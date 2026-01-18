import os
from topsis_siddharth.core import topsis  # adjust if function name differs
import subprocess
import sys

def parse_weights(weights_str: str):
    try:
        weights = [float(w.strip()) for w in weights_str.split(",")]
    except ValueError:
        raise ValueError("Weights must be numeric and comma-separated")
    return weights


def parse_impacts(impacts_str: str):
    impacts = [i.strip() for i in impacts_str.split(",")]
    for i in impacts:
        if i not in ["+", "-"]:
            raise ValueError("Impacts must be '+' or '-'")
    return impacts


def run_topsis(input_csv, output_csv, weights, impacts):
    """
    Run TOPSIS CLI command using subprocess.
    """
    command = [
        sys.executable, "-m", "topsis_siddharth.cli",
        input_csv,
        ",".join(map(str, weights)),
        ",".join(impacts),
        output_csv
    ]

    result = subprocess.run(
        command,
        capture_output=True,
        text=True
    )

    if result.returncode != 0:
        raise RuntimeError(result.stderr)
