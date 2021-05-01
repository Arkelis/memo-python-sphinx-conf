.. Mémo Python documentation master file, created by
   sphinx-quickstart on Tue Sep  4 14:09:02 2018.
   You can adapt this file completely to your liking, but it should at least
   contain the root `toctree` directive.

=================
Grand Mémo Python
=================

.. warning::

    Ceci est la version web du PDF https://www.pycolore.fr/python.pdf. Elle est en
    cours de construction et n'est pas aussi complète. Il y a aussi des bugs,
    notamment de liens internes.

Le document considère que vous avez au moins un niveau prépa en Python,
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

Ce document est écrit au format TeX puis compilé avec XeLaTeX (et minted
pour les sections de code) tantôt sur Windows, tantôt sur Fedora (ça ne
change pas le résultat). Il est disponible au téléchargement (pour
mettre le document à jour) en cliquant sur ce lien:
`https://www.pycolore.fr/python.pdf <https://www.pycolore.fr/python.pdf>`__.

Vous lisez la version Web.

.. admonition:: Notation

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

    Ce document est encore incomplet, des sections sont susceptibles d’être vides.

.. toctree::
   :maxdepth: 2

   introduction/poo.rst
   poo/index.rst
   stdlib/bibliotheques.rst
