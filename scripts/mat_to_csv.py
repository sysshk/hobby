#!/usr/bin/env python3
"""
IndPenSim .mat  ->  CSV 변환기

업로드 API가 기대하는 컬럼으로 변환한다:
  batchNumber, controlType, timeHr, temperature, ph, dissolvedO2, substrate, penicillin

사용:
  pip install scipy numpy pandas
  python scripts/mat_to_csv.py <input.mat> <output.csv> [--batch 1] [--control recipe]

주의: IndPenSim .mat 내부 변수명은 배포본마다 조금씩 다르다.
      아래 FIELD_MAP 을 네 .mat 구조에 맞게 수정해라.
      (loadmat 후 print(data.keys()) 로 실제 키를 확인)
"""
import sys
import argparse
import numpy as np
import pandas as pd
from scipy.io import loadmat

# 네 .mat 의 실제 필드명 -> CSV 컬럼명 매핑 (필요시 수정)
FIELD_MAP = {
    "timeHr":      ["Time", "time", "t"],
    "temperature": ["Temperature", "T"],
    "ph":          ["pH", "PH", "ph"],
    "dissolvedO2": ["DO2", "DO", "dissolvedO2"],
    "substrate":   ["S", "Substrate", "substrate"],
    "penicillin":  ["P", "Penicillin", "penicillin"],
}


def pick(container, names):
    """container(dict/struct)에서 후보 이름 중 존재하는 값을 1차원 배열로 반환."""
    for n in names:
        if isinstance(container, dict) and n in container:
            return np.ravel(container[n])
        if hasattr(container, n):
            return np.ravel(getattr(container, n))
    return None


def main():
    ap = argparse.ArgumentParser()
    ap.add_argument("input")
    ap.add_argument("output")
    ap.add_argument("--batch", type=int, default=1, help="batchNumber")
    ap.add_argument("--control", default="recipe", help="controlType")
    args = ap.parse_args()

    mat = loadmat(args.input, squeeze_me=True, struct_as_record=False)
    # 상단 메타키 제거
    keys = [k for k in mat.keys() if not k.startswith("__")]
    print("최상위 키:", keys)

    # 대부분 하나의 struct 안에 시계열이 들어있다. 가장 큰 struct를 후보로.
    root = mat[keys[0]] if len(keys) == 1 else mat

    cols = {}
    for out_name, candidates in FIELD_MAP.items():
        vals = pick(root, candidates) if not isinstance(root, dict) else pick(mat, candidates)
        if vals is None:
            vals = pick(mat, candidates)
        if vals is None:
            print(f"!! '{out_name}' 를 못 찾음 — FIELD_MAP 을 수정하세요. 0으로 채웁니다.")
        cols[out_name] = vals

    n = max((len(v) for v in cols.values() if v is not None), default=0)
    df = pd.DataFrame({k: (v if v is not None else np.zeros(n)) for k, v in cols.items()})
    df.insert(0, "controlType", args.control)
    df.insert(0, "batchNumber", args.batch)
    df = df[["batchNumber", "controlType", "timeHr", "temperature",
             "ph", "dissolvedO2", "substrate", "penicillin"]]
    df.to_csv(args.output, index=False)
    print(f"저장 완료: {args.output}  ({len(df)} rows)")


if __name__ == "__main__":
    main()
