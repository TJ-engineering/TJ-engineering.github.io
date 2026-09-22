# TJ Engineering

The TJ Engineering project portfolio, powered by `data/projects.json`.

Mission: Engineering Open-Source software at the intersection of advanced technology and academic scholarship, specializing in textual corpus research and biblical studies.

## Edit and preview

Edit `data/projects.json` to manage projects, descriptions, logos, and publication links. See [the editing guide](docs/README.md).

Run `python -m http.server 8000` from this repository and open http://localhost:8000.

## GitHub Pages

In Settings → Pages, select **Deploy from a branch**, **main**, and **/ (root)**. The site address is https://tj-engineering.github.io/.

The site files were copied from [TJ-engineering/placeholder](https://github.com/TJ-engineering/placeholder), commit `eba8417`. This repository keeps its own Git history. The website files live at the root here instead of under `docs`.

## Automated data validation

The **Validate project JSON** GitHub Action runs on pushes, pull requests, and manual dispatch. It checks JSON syntax, duplicate keys and project IDs, required fields, statuses, and logo/resource field types. Run the same check locally with `python scripts/validate_projects.py`. It uses only the Python standard library. A failing check reports the invalid field; it does not automatically block branch pushes or Pages deployments.
