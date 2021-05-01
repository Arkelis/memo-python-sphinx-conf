Introduction
============

Objets
++++++

.. admonition:: Fil rouge

    Dans cette partie, nous allons modéliser un monde peuplé de fourmis.

Tout est objet en Python, des nombres aux listes en passant par les
modules et les exceptions. Tout objet possède un type, un autre objet
qui est responsable de sa création. On peut le récupérer grâce à la
fonction native ``type()``:

.. code:: pycon

   >>> type(1)
   <class 'int'>
   >>> type([1, 2, 3])
   <class 'list'>
   >>> import os # on importe un module
   >>> type(os) # et on lui demande son type
   <class 'module'>

On peut demander le type de leur type:

.. code:: pycon

   >>> type(type(1))
   <class 'type'>
   >>> type(type([1, 2, 3]))
   <class 'type'>
   >>> type(type(os))
   <class 'type'>

Nativement, tous les types sont créés par ``type``. On peut créer nos
objets nous-mêmes grâce à ``type()``: il suffit de lui donner un nom de
type, un tuple contenant ses parents et un dictionnaire d’attributs.

Commençons par créer un objet élémentaire sans attribut ni parent.

.. code:: pycon

   >>> Fourmi = type("Fourmi", (), {})
   >>> Fourmi
   <class '__main__.Fourmi'>

On vient de créer notre premier type d’objet, il s’agit d’une classe.
Les objets créés à partir d’une classe sont appelés instances. Créons
maintenant notre première instance.

.. code:: pycon

   >>> fourmi = Fourmi() # on appelle la classe pour l'instancier
   >>> fourmi # fourmi est une instance de Fourmi
   <__main__.Fourmi object at 0x7f593a678550>
   >>> type(fourmi)
   <class '__main__.Fourmi'> # son type est bien la classe Fourmi
   >>> fourmi.role = "ouvrière" # on peut lui donner un attribut
   >>> fourmi.role # puis y accéder
   'ouvrière'
   >>> vars(fourmi) # on peut aussi demander tous ses attributs
   {'role': 'ouvrière'}

Par défaut, on peut ajouter à la volée de nouveaux attributs à un objet
instancié par une classe. En pratique, on ne crée pas nos classes avec
la fonction ``type()``, ce n’est pas très pratique si on veut que notre
classe ait un comportement plus complexe. En effet, une classe peut
posséder des méthodes, des propriétés, que l’on préfère écrire en
utilisant la définition de classes.

Classes
+++++++

Structure d’une classe
----------------------

Les classes permettent des créer des objets appelés instances qui
partagent des caractéristiques communes. Une classe est en fait un
gabarit qui nous permet de créer un certain type d’objets. Si on réécrit
notre exemple précédent, ça donne ça :

.. code:: python3

   class Fourmi:
       ...

Il n’y a pas grand chose dedans pour l’instant, mais ça va venir!

Les objets instanciés par une classe partagent des caractéristiques
communes à la classe:

#. des attributs, des variables propres aux instances;

#. des méthodes, des fonctions propres aux instances et qui agissent par
   exemple sur leurs attributs.

Les classes sont des gabarits qui permettent de créer un même type
d’objet.

Attributs
~~~~~~~~~

Nous allons créer la classe représentant le monde dans lequel vont
évoluer les fourmis. On considère qu’il s’agit d’une grille ayant une
certaine hauteur et une certaine largeur:

.. code:: python3

   class Monde:
       hauteur = 32
       largeur = 32

Les variables ``hauteur`` et ``largeur`` sont appelées attributs de
classe. Chaque objet de cette classe y aura accès:

.. code:: pycon

   >>> monde1 = Monde()
   >>> monde1.hauteur
   32
   >>> monde2 = Monde()
   >>> monde2.largeur
   32

Nos mondes ont une largeur et une hauteur, mais comme ce sont des
attributs de classe, ils ont tous la même taille; ce serait plus
intéressant de créer des mondes de taille différentes. On peut
parfaitement surcharger les attributs de classe pour en faire des
attributs d’instance:

.. code:: pycon

   >>> monde1.largeur = 64
   >>> vars(monde1)
   {'largeur': 64}

On remarque que les attributs de classe ne sont pas renvoyées par
``vars()``. Cela est dû au fait que les attributs de classe sont gardés
uniquement dans la classe; ainsi une modification d’attribut de classe
impactera toutes les instances.

Initialisation
~~~~~~~~~~~~~~

Maintenant, on veut pouvoir initialiser automatiquement des variables.
Définir la taille des mondes après leur création n’est pas gênant pour
l’instant, mais quand l’initialisation comprend de nombreux attributs,
cela devient fastidieux. On crée pour cela une fonction dans la classe
appelée initialiseur.

.. code:: python3

   class Monde:
       def __init__(self, hauteur, largeur):
           self.hauteur = hauteur
           self.largeur = largeur

On peut alors passer directement la hauteur et la largeur lors de
l’appel de la classe pour l’instanciation. Ces arguments sont
automatiquement passés à ``__init__()``:

.. code:: pycon

   >>> monde1 = Monde(32, 32)
   >>> monde2 = Monde(largeur=64, hauteur=128)
   >>> vars(monde1)
   {'hauteur': 32, 'largeur': 32}
   >>> vars(monde2)
   {'hauteur': 128, 'largeur': 64}

Méthodes
~~~~~~~~

Les fonctions définies dans les classes sont appelées méthodes, c’est le
cas de l’initialiseur ``__init__()``. On peut en définir d’autres pour
implémenter des comportements aux instances. Par exemple, on peut
permettre à une fourmi de se déplacer:

.. code:: python3

   class Fourmi:
       def __init__(self, role, x, y):
           self.role = role
           self.x = x
           self.y = y
       
       def move(self, x, y):
           self.x += x
           self.y += y

Une méthode s’utilise comme ceci:

.. code:: pycon

   >>> fourmi = Fourmi('ouvrière', 0, 0)
   >>> fourmi.move(1, 1)
   >>> vars(fourmi)
   {'role: 'ouvrière', 'x': 1, 'y': 1}

Lorsque l’on évalue une méthode sur une instance, Python lui passe
automatiquement en premier paramètre l’instance en question. Par
convention on nomme donc toujours le premier paramètre des méthodes
``self`` qui fait référence à l’instance en cours.

Encapsulation : les propriétés
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

On a défini une classe Monde et une classe Foumi qui peut se déplacer.
Maintenant, on veut que les fourmis ne puissent pas sortir du monde. On
serait tenté d’utiliser des getters et setters (ou accesseurs et
mutateurs):

.. code:: python3

   class Fourmi:
       def __init__(self, role, x, y, monde):
           self.role = role
           self.set_x(x)
           self.set_y(y)
           self.monde = monde

       def set_x(self, x):
           if x > self.monde.largeur:
               raise ValueError("{} est trop grand.".format(x))
           self.x = x
       
       def set_y(self, y):
           if y > self.monde.hauteur:
               raise ValueError("{} est trop grand.".format(y))
           self.y = y

       def move(self, x, y):
           self.set_x(x)
           self.set_y(y)

Python possède un mécanisme d’encapsulation qui s’appelle les
propriétés, elles permettent d’avoir le même genre de comportement, mais
de manière transparente car la modification de valeurs d’attributs garde
la même syntaxe :

.. code:: python3

   class Fourmi:
       def __init__(self, role, x, y, monde):
           self.role = role
           self.monde = monde
           self.x = x
           self.y = y

       @property
       def x(self):
           return self._x

       @x.setter
       def x(self, value):
           if not 0 <= value < self.monde.largeur:
               raise ValueError("{} n'est pas compris entre 0 et {}.".format(value, self.monde.largeur))    
           self._x = value
               
       @property
       def y(self):
           return self._y

       @y.setter
       def y(self, value):
           if not 0 <= value < self.monde.hauteur:
               raise ValueError("{} n'est pas compris entre 0 et {}.".format(value, self.monde.hauteur))
           self._y = value

       def move(self, x, y):
           self.x = x
           self.y = y

Une mauvaise affectation de ``x`` ou ``y`` engendrera une erreur:

.. code:: pycon

   >>> monde = Monde(32, 32)
   >>> fourmi = Fourmi('ouvrière', 0, 0, monde)
   >>> fourmi.x = -1
   File "<stdin>", line 1, in <module>
       fourmi.x = -1
   File "<stdin", line 15, in x
       raise ValueError("{} est trop grand.".format(value))    
   ValueError: -1 n'est pas compris en tre 0 et 32.

Les propriétés utilisent un élément de syntaxe appelé décorateur (les
lignes commençant par @), mécanisme décrit plus loin dans le document.
On utilise ici les propriétés pour l’encapsulation d’attributs, mais
elles sont également utiles pour des attributs calculés :

.. code:: python3

   class Fourmi:
       # contenu précédent

       @property
       def distance_origine(self):
           return math.sqrt(self.x**2 + self.y**2)

On fait appel à cette propriété comme à un attribut classique:

.. code:: pycon

   >>> fourmi.move(3, 4)
   >>> fourmi.distance_origine
   5.0

**Remarque :** Les attributs privés n’existent pas en Python. Par
convention, les attributs auxquels il est déconseillé d’accéder sont
préfixés par un souligné : ``_attribut_prive``.

Héritage
--------

On peut créer des fourmis et leur associer un rôle. Cependant, un rôle
différent engendrera un comportement différent (donc des méthodes
différentes). Pour illustrer cela, on peut utiliser l’héritage:

.. code:: python3

   class Fourmi:
       def __init__(self, x, y, monde):
           self.x = x
           self.y = y
           self.monde = monde
       
       # le reste de la classe fourmi précédente


   class Ouvriere(Fourmi):
       role = "ouvrière"

       def chercher_nourriture(self):
           ...


   class Reine(Fourmi):
       role = "reine"

       def pondre_oeuf(self):
           ...

Ici, les nouvelles classes ``Ouvriere`` et ``Reine`` héritent de la
classe ``Fourmi``: elles héritent donc de tout le contenu de cette
dernière. Autrement dit, tout ce qui est défini dans la classe
``Fourmi`` l’est aussi pour ``Ouvriere`` et ``Reine``. Comme on sait que
le rôle sera le même pour les fourmis instanciées par une même classe,
on peut en faire un attribut de classe. Chaque classe fille possède son
propre comportement : seules les ouvrières peuvent aller chercher de la
nourriture, tandis que la reine sait pondre des oeufs.

Affichage
---------

Si l’on essaie d’afficher une fourmi dans l’interpréteur, cela ne donne
pas grand chose:

.. code:: pycon

   >>> fourmi = Ouvriere()
   >>> print(fourmi)
   >>> fourmi
   <__main__.Ouvriere object at 0x7f8db5e1b070>

Par défaut afficher ou évaluer un objet nous donne son type et son
adresse mémoire au format hexadécimal. On peut redéfinir cet affichage
grâce à deux méthodes ``__repr__()`` et ``__str__()``, la première étant
utilisée lorsqu’on évalue un objet, la seconde lorsqu’on la passe à
``str()`` ou ``print()``.

.. code:: python3

   class Monde:
       ...

       def __repr__(self):
           return f"Monde(hauteur={self.hauteur}, largeur={self.largeur})"


   class Fourmi:
       ...

       def __repr__(self):
           return f"{self.__class__.__name__}(x={self.x}, y={self.y}, monde={self.monde})"
       

       def __str__(self):
           return f"fourmi {self.role} située aux coordonnées ({self.x}, self.y})"

On essaie de renvoyer en général une chaine de caractères permettant de
recréer l’objet facilement avec ``__repr__()``. On peut être plus souple
avec ``__str__()``.

.. code:: pycon

   >>> monde = Monde(16, 16)
   >>> ouvriere = Ouvriere(0, 0, monde)
   >>> ouvriere
   Ouvriere(x=0, y=0, monde=Monde(hauteur=16, largeur=16))
   >>> print(ouvriere)
   fourmi ouvrière

Méthodes spéciales
------------------

La méthode ``__repr__()`` que l’on vient d’implémenter est une méthode
dite spéciale; on repère de telles méthodes par la présence de deux
soulignés qui précèdent et suivent leurs noms. Elles permettent de
donner des comportements spécialisés aux objets. On peut par exemple
faire en sorte de pouvoir boucler facilement sur un monde pour parcourir
toutes les fourmis qui le peuplent.

.. code:: python3

   class Monde:
       def __int__(self, hauteur, largeur):
           self.hauteur = hauteur
           self.largeur = largeur
           self.fourmis = []

       def creer_ouvriere(x, y):
           """Crée une fourmi ouvrière à la position donnée."""
           self.fourmis.append(Ouvriere(x, y, self))
       
       def __iter__(self):
           return self.fourmis.__iter__()

On peut maintenant créer un monde, lui ajouter des fourmis et les
parcourir.

.. code:: pycon

   >>> monde = Monde(16, 16)
   >>> for i in range(10):
   ...     monde.creer_ouvriere(i, i)
   ... 
   >>> for fourmi in monde:
   ...     print(fourmi)
   ...
   fourmi ouvrière située aux coordonnées (0, 0)
   fourmi ouvrière située aux coordonnées (1, 1)
   fourmi ouvrière située aux coordonnées (2, 2)
   fourmi ouvrière située aux coordonnées (3, 3)
   fourmi ouvrière située aux coordonnées (4, 4)
   fourmi ouvrière située aux coordonnées (5, 5)
   fourmi ouvrière située aux coordonnées (6, 6)
   fourmi ouvrière située aux coordonnées (7, 7)
   fourmi ouvrière située aux coordonnées (8, 8)
   fourmi ouvrière située aux coordonnées (9, 9)
