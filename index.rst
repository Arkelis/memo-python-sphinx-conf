=================
Grand Mémo Python
=================

Ce mémo considère que vous avez au moins un niveau prépa en Python,
(tout simplement parce que c'est avec ce niveau que j'ai commencé à le rédiger)
la définition de fonctions, les boucles, les conditions et la manipulation
des listes est supposée connue. La première partie concerne la
programmation orientée objet et le modèle de données de Python. Les deux
parties suivantes concernent des modules de la bibliothèque standard et
des modules communautaires. Les liens Plus d’informations pointent vers
les sources utilisées.

Sauf exception, on considère qu’on travaille sur **Python 3.7** et sur
une distribution GNU/Linux (par exemple: Linux Mint, Fedora, Solus,
Debian, Arch Linux).

Ce document est écrit au format reStructuredText puis compilé avec l'utilitaire
Sphinx.

.. admonition:: Notation
   :class: tip

   Pour la documentation des méthodes:

   -  on note ``Classe.methode(self, *args, **kwargs)`` (avec le nom de
      classe en ``PascalCase``);

   -  on note ``obj.methode(*args, **kwargs)`` (avec le nom de l’objet
      en ``snake_case``).

.. admonition:: Auteur

   Je m'appelle Guillaume Fayard, étudiant en école d'ingénieur à Centrale
   Lille. Je rédige ce document au fur et à mesure que j'en apprends sur
   Python. Bonne lecture !

.. admonition:: Code source

   Le code source de ce mémo est disponible sur
   `GitHub <https://github.com/Arkelis/memo-python>`__.


.. warning::

    Ce document en constante construction, des sections sont susceptibles d’être vides.

.. toctree::
   :maxdepth: 2

   introduction/poo.rst
   poo/index.rst
   stdlib/bibliotheques.rst
