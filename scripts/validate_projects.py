"""Validate portfolio JSON without third-party dependencies."""
import json
from pathlib import Path
import sys


def unique_object(pairs):
    result = {}
    for key, value in pairs:
        if key in result:
            raise ValueError(f"Duplicate JSON key: {key}")
        result[key] = value
    return result


def reject_constant(value):
    raise ValueError(f"Invalid JSON constant: {value}")


def validate(data):
    def require(condition, message):
        if not condition:
            raise ValueError(message)

    def text(value):
        return isinstance(value, str) and bool(value.strip())

    require(isinstance(data, dict), 'Root must be an object')
    site = data.get('site')
    require(isinstance(site, dict), 'site must be an object')
    for key in ('name', 'tagline', 'description', 'githubUrl'):
        require(text(site.get(key)), f'site.{key} must be a nonempty string')
    projects = data.get('projects')
    require(isinstance(projects, list), 'projects must be an array')
    ids = set()
    for index, project in enumerate(projects):
        label = f'projects[{index}]'
        require(isinstance(project, dict), f'{label} must be an object')
        for key in ('id', 'title', 'summary', 'category'):
            require(text(project.get(key)), f'{label}.{key} must be a nonempty string')
        require(project['id'] not in ids, f"Duplicate project ID: {project['id']}")
        ids.add(project['id'])
        require(project.get('status') in ('planned', 'active', 'available', 'completed', 'archived'), f'{label}.status is invalid')
        tags = project.get('tags')
        require(isinstance(tags, list) and all(text(tag) for tag in tags), f'{label}.tags must be an array of nonempty strings')
        require(isinstance(project.get('featured'), bool), f'{label}.featured must be a boolean')
        for key in ('url', 'repository'):
            require(isinstance(project.get(key), str), f'{label}.{key} must be a string (empty is allowed)')
        logo = project.get('logo')
        if logo is not None:
            require(isinstance(logo, dict), f'{label}.logo must be an object')
            for key in ('src', 'alt'):
                require(isinstance(logo.get(key), str), f'{label}.logo.{key} must be a string')
        resources = project.get('resources')
        if resources is not None:
            require(isinstance(resources, list), f'{label}.resources must be an array')
            for resource in resources:
                require(isinstance(resource, dict), f'{label} resource must be an object')
                for key in ('title', 'url'):
                    require(text(resource.get(key)), f'{label} resource {key} must be a nonempty string')
                require('type' not in resource or isinstance(resource['type'], str), f'{label} resource type must be a string')
    return len(projects)


def main():
    path = Path(__file__).resolve().parents[1] / 'data' / 'projects.json'
    try:
        data = json.loads(path.read_text(encoding='utf-8-sig'), object_pairs_hook=unique_object, parse_constant=reject_constant)
        count = validate(data)
    except (OSError, ValueError) as error:
        print(f'Validation failed: {error}', file=sys.stderr)
        return 1
    print(f'Validated {count} projects in {path.name}')
    return 0


if __name__ == '__main__':
    sys.exit(main())
