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
