import json, sys
from jsonschema import validate, ValidationError

def main(file_path):
    with open('schema/modelcard_schema.json') as schema_file:
        schema = json.load(schema_file)
    with open(file_path) as data_file:
        data = json.load(data_file)
    try:
        validate(instance=data, schema=schema)
        print(f"{file_path}: VALID")
    except ValidationError as e:
        print(f"{file_path}: INVALID -> {e.message}")

if __name__ == "__main__":
    for path in sys.argv[1:]:
        main(path)
