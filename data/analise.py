import json
from collections import defaultdict

def make_hashable(value):
    """ Convert lists to tuples recursively to ensure they are hashable. """
    if isinstance(value, list):
        return tuple(make_hashable(item) for item in value)
    return value

def list_unique_values(json_filename):
    with open(json_filename, 'r', encoding='utf-8') as f:
        data = json.load(f)

    unique_values = defaultdict(set)

    for entry in data:
        for key, value in entry.items():
            if isinstance(value, list):
                for item in value:
                    unique_values[key].add(make_hashable(item))
            else:
                unique_values[key].add(make_hashable(value))
    
    unique_values = {key: list(values) for key, values in unique_values.items()}

    return unique_values

def save_unique_values_to_json(unique_values, output_filename):
    with open(output_filename, 'w', encoding='utf-8') as f:
        json.dump(unique_values, f, ensure_ascii=False, indent=4)

unique_values = list_unique_values('inquiricoes.json')
save_unique_values_to_json(unique_values, 'unique_values.json')

