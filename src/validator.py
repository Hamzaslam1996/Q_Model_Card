#!/usr/bin/env python3
"""
Validator for Quantum Model Card JSON files against the schema.
"""
import json
import sys
from pathlib import Path
import jsonschema
from jsonschema import validate


def load_json_file(filepath):
    """Load JSON file and return parsed content."""
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        print(f"Error: File not found: {filepath}")
        sys.exit(1)
    except json.JSONDecodeError as e:
        print(f"Error: Invalid JSON in {filepath}: {e}")
        sys.exit(1)


def validate_modelcard(json_data, schema):
    """Validate JSON data against the schema."""
    try:
        validate(instance=json_data, schema=schema)
        return True
    except jsonschema.exceptions.ValidationError as e:
        print(f"Validation Error: {e.message}")
        print(f"Failed at path: {' -> '.join(str(p) for p in e.path)}")
        return False
    except jsonschema.exceptions.SchemaError as e:
        print(f"Schema Error: {e.message}")
        return False


def main():
    """Main function to validate a model card JSON file."""
    if len(sys.argv) != 2:
        print("Usage: python validator.py <path_to_json_file>")
        sys.exit(1)
    
    json_filepath = sys.argv[1]
    
    # Determine schema path relative to script location
    script_dir = Path(__file__).parent
    schema_path = script_dir.parent / "schema" / "modelcard_schema.json"
    
    # Load schema
    print(f"Loading schema from: {schema_path}")
    schema = load_json_file(schema_path)
    
    # Load JSON file to validate
    print(f"Loading JSON file: {json_filepath}")
    json_data = load_json_file(json_filepath)
    
    # Validate
    print(f"Validating {json_filepath}...")
    if validate_modelcard(json_data, schema):
        print(f"✓ {json_filepath} is valid!")
        sys.exit(0)
    else:
        print(f"✗ {json_filepath} is invalid!")
        sys.exit(1)


if __name__ == "__main__":
    main()
