from __future__ import annotations

import argparse
import html
from pathlib import Path


START_MARKER = "<!-- GENERATED_LINKS_START -->"
END_MARKER = "<!-- GENERATED_LINKS_END -->"


def build_cards(directory_names: list[str]) -> str:
    if not directory_names:
        return """          <article class=\"student-card student-card-empty\">\n            <h3>Zatial bez preview stranok</h3>\n            <p>\n              Po prvom deployi z vedlajsej branche sa sem automaticky doplni\n              odkaz na novu studentsku stranku.\n            </p>\n          </article>"""

    cards = []
    for directory_name in directory_names:
        safe_name = html.escape(directory_name)
        cards.append(
            "\n".join(
                [
                    '          <article class="student-card">',
                    f"            <h3>{safe_name}</h3>",
                    "            <p>",
                    "              Preview nasadeny z branch preview priecinka na serveri.",
                    "            </p>",
                    f'            <a href="./{safe_name}/">Otvorit stranku</a>',
                    "          </article>",
                ]
            )
        )

    return "\n".join(cards)


def render(template_path: Path, output_path: Path, directory_names: list[str]) -> None:
    template = template_path.read_text(encoding="utf-8")
    if START_MARKER not in template or END_MARKER not in template:
        raise ValueError("Template file is missing generation markers.")

    start_index = template.index(START_MARKER) + len(START_MARKER)
    end_index = template.index(END_MARKER)

    rendered_links = "\n" + build_cards(directory_names) + "\n        "
    output = template[:start_index] + rendered_links + template[end_index:]
    output_path.write_text(output, encoding="utf-8")


def parse_args() -> argparse.Namespace:
    parser = argparse.ArgumentParser()
    parser.add_argument("--template", required=True)
    parser.add_argument("--output", required=True)
    parser.add_argument("--dirs-file", required=True)
    return parser.parse_args()


def main() -> None:
    args = parse_args()
    template_path = Path(args.template)
    output_path = Path(args.output)
    dirs_file = Path(args.dirs_file)
    directory_names = [
        line.strip() for line in dirs_file.read_text(encoding="utf-8").splitlines() if line.strip()
    ]
    render(template_path, output_path, directory_names)


if __name__ == "__main__":
    main()