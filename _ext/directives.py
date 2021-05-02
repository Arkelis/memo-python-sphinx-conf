from docutils import nodes
from docutils.parsers.rst import Directive

class HelloWorld(Directive):
    def run(self):
        return [
            nodes.paragraph(text="Hello world!")
        ]


def setup(app):
    app.add_directive("hello", HelloWorld)

    return {
        "version": "0.1",
        "parallel_read_safe": True,
        "parallel_write_safe": True,
    }
