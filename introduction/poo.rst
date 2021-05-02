Introduction
============

Objets
++++++

.. admonition:: Fil rouge

    Dans cette partie, nous allons modéliser un monde peuplé de fourmis.

Tout est objet en Python, des nombres aux listes en passant par les
modules et les exceptions. Par exemple, on peut visualiser tous les
attributs et méthodes d'un entier :

.. code::

   >>> dir(1)
   ['__abs__',
    '__add__',
    '__and__',
    '__bool__',
    '__ceil__',
    '__class__',
    '__delattr__',
    '__dir__',
    '__divmod__',
    '__doc__',
    '__eq__',
    '__float__',
    '__floor__',
    '__floordiv__',
    '__format__',
    '__ge__',
    '__getattribute__',
    '__getnewargs__',
    '__gt__',
    '__hash__',
    '__index__',
    '__init__',
    '__init_subclass__',
    '__int__',
    '__invert__',
    '__le__',
    '__lshift__',
    '__lt__',
    '__mod__',
    '__mul__',
    '__ne__',
    '__neg__',
    '__new__',
    '__or__',
    '__pos__',
    '__pow__',
    '__radd__',
    '__rand__',
    '__rdivmod__',
    '__reduce__',
    '__reduce_ex__',
    '__repr__',
    '__rfloordiv__',
    '__rlshift__',
    '__rmod__',
    '__rmul__',
    '__ror__',
    '__round__',
    '__rpow__',
    '__rrshift__',
    '__rshift__',
    '__rsub__',
    '__rtruediv__',
    '__rxor__',
    '__setattr__',
    '__sizeof__',
    '__str__',
    '__sub__',
    '__subclasshook__',
    '__truediv__',
    '__trunc__',
    '__xor__',
    'as_integer_ratio',
    'bit_length',
    'conjugate',
    'denominator',
    'from_bytes',
    'imag',
    'numerator',
    'real',
    'to_bytes']

Tout objet possède un type, un autre objet
qui est responsable de sa création. On peut le récupérer grâce à la
fonction native ``type()`` :

.. code:: pycon

   >>> type(1)
   <class 'int'>
   >>> type([1, 2, 3])
   <class 'list'>
   >>> import os # on importe un module
   >>> type(os) # et on lui demande son type
   <class 'module'>

On peut demander le type de leur type :

.. code:: pycon

   >>> type(type(1))
   <class 'type'>
   >>> type(type([1, 2, 3]))
   <class 'type'>
   >>> type(type(os))
   <class 'type'>

Toues les types natifs sont créés par ``type()``. On peut créer le nôtre 
grâce à cette fonction : il suffit de lui donner un nom de type, un tuple
contenant ses parents et un dictionnaire d’attributs.

Commençons par créer un type d'objet élémentaire sans attribut ni parent.

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
instancié par une classe. En pratique, on ne définit pas nos classes avec
la fonction ``type()`` directement, sauf dans des cas où l'on veut créer
des classes dynamiquement. On utilise plutôt l'instruction ``class``.

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
       pass

Il n’y a pas grand chose dedans pour l’instant, mais ça va venir!

Les objets instanciés par une classe partagent des caractéristiques
communes à la classe:

#. des attributs, des variables propres aux instances;

#. des méthodes, des fonctions propres aux instances et qui agissent par
   exemple sur leurs attributs.

Les classes sont des gabarits qui permettent de créer des objets du même
type.

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
attributs de classe, ils ont tous la même taille ; ce serait plus
intéressant de créer des mondes de taille différentes. On peut
parfaitement surcharger les attributs de classe pour en faire des
attributs d’instance:

.. code:: pycon

   >>> monde1.largeur = 64
   >>> vars(monde1)
   {'largeur': 64}

.. admonition:: Remarque
    :class: tip

    Les attributs de classe ne sont pas renvoyées par
    ``vars()``. Cela est dû au fait que les attributs de classe sont gardés
    uniquement dans la classe (dans l'attribut spécial ``__dict__``) ;
    ainsi une modification d’attribut de classe impactera toutes les instances.

    Appeler ``vars(objet)`` renvoie ``objet.__dict__``.

Méthodes
~~~~~~~~

On peut définir des opérations qui vont agir sur l'état des instances (leurs
attributs). De telles fonctions sont appelées méthodes, elles prennent en 
premier paramètre l'instance elle-même, nommé par convention ``self``. Par
exemple, on peut définir une méthodes qui va permettre à la fourmi de se déplacer

.. code:: python3

   class Fourmi:
       x = 0
       y = 0

       def bouger(self, x, y):
           self.x += x
           self.y += y

Une méthode s’utilise comme ceci:

.. code:: pycon

   >>> fourmi = Fourmi()
   >>> fourmi.bouger(1, 1)
   >>> vars(fourmi)
   {'x': 1, 'y': 1}

.. admonition:: Remarque
   :class: tip

   Lorsqu'on appelle une méthode sur une instance, Python passe automatiquement
   l'instance en tant que premier paramètre, il n'est pas nécessaire de fournir
   l'argument ``self``. 
   
   En fait, lorsque l'on écrit, ``objet.methode(argument)``, c'est comme si
   l'on écrivait ``Classe.methode(objet, argument)``. Derrière ce comportement
   se cache le mécanisme des descripteurs.

Initialisation
--------------

Maintenant, on veut pouvoir initialiser automatiquement les attributs d'une
instance à sa création, par exemple donner une position de départ pour les
fourmis différente de (0, 0) et une taille personnalisée aux mondes :

.. code:: python3

   class Fourmi:
       def __init__(self, x, y):
           self.x = x
           self.y = y

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

Encapsulation : les propriétés
------------------------------

On a défini une classe Monde et une classe Foumi qui peut se déplacer.
Maintenant, on veut que les fourmis ne puissent pas sortir du monde.
Pour cela, on va encapsuler les attributs dans des propriétés.

On commence par ajouter à l'initialiseur le monde dans lequel la fourmi va
se déplacer.

.. code:: python3

   class Fourmi:
       def __init__(self, role, x, y, monde):
           self.role = role
           self.monde = monde
           self.x = x
           self.y = y

On va ensuite définir les propriétés ``x`` et ``y`` grâce à des décorateurs.
Chacune possèdera un accesseur (`getter`) et un mutateur (`setter`). 

.. code:: python3

   class Fourmi:
       # ... constructeur ...

       @property
       def x(self):
           """Accesseur de la propriété x."""
           # on stocke la véritable valeur dans un attribut dit "privé"
           return self._x

       @x.setter
       def x(self, value):
           """Mutateur de la propriété x."""
           if not 0 <= value < self.monde.largeur:
               raise ValueError("{} n'est pas compris entre 0 et {}.".format(value, self.monde.largeur))
           # c'est ici que l'on affecte la nouvelle valeur à l'attribut privé _x.
           self._x = value
               
       @property
       def y(self):
           return self._y

       @y.setter
       def y(self, value):
           if not 0 <= value < self.monde.hauteur:
               raise ValueError("{} n'est pas compris entre 0 et {}.".format(value, self.monde.hauteur))
           self._y = value

       def bouger(self, x, y):
           self.x = x
           self.y = y

On accède à ces propriétés comme on le ferait avec des attributs classiques :

.. code:: pycon

   >>> m = Monde(32, 32)
   >>> fourmi = Fourmi(0, 0, m)
   >>> fourmi.bouger(1, 2)
   >>> fourmi.x
   1
   >>> fourmi.x = 3
   >>> fourmi.x
   3

Une mauvaise affectation de ``x`` ou ``y`` engendrera une erreur:

.. code:: pycon

   >>> m = Monde(32, 32)
   >>> fourmi = Fourmi(0, 0, m)
   >>> fourmi.x = -1
   File "<stdin>", line 1, in <module>
       fourmi.x = -1
   File "<stdin", line 15, in x
       raise ValueError...  
   ValueError: -1 n'est pas compris entre 0 et 32.

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

.. admonition:: Convention sur les attributs privés
   
   Les attributs privés n’existent pas en Python. Par
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
           print("Oeuf pondu")

Ici, les nouvelles classes ``Ouvriere`` et ``Reine`` héritent de la
classe ``Fourmi``: elles héritent donc de tout le contenu de cette
dernière. Autrement dit, tout ce qui est défini dans la classe
``Fourmi`` l’est aussi pour ``Ouvriere`` et ``Reine``. Comme on sait que
le rôle sera le même pour les fourmis instanciées par une même classe,
on peut en faire un attribut de classe. Chaque classe fille possède son
propre comportement : seules les ouvrières peuvent aller chercher de la
nourriture, tandis que la reine sait pondre des oeufs. Néanmoins les deux
classes de fourmis peuvent bouger

.. code:: pycon

   >>> m = Monde(32, 32)
   >>> ouvriere = Ouvriere(0, 0, m)
   >>> reine = Reine(0, 0, m)
   >>> reine.pondre_oeuf()
   Oeuf pondu
   >>> reine.bouger(1, 1)
   >>> reine.x
   1

Affichage
---------

Si l’on essaie d’afficher une fourmi dans l’interpréteur, cela ne donne
pas grand chose:

.. code:: pycon

   >>> fourmi = Ouvriere()
   >>> print(fourmi)
   <__main__.Ouvriere object at 0x7f8db5e1b070>
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
           return f"fourmi {self.role} située aux coordonnées ({self.x}, {self.y})"

On essaie de renvoyer en général une chaine de caractères permettant de
recréer l’objet facilement avec ``__repr__()``. On peut être plus souple
avec ``__str__()``.

.. code:: pycon

   >>> monde = Monde(16, 16)
   >>> ouvriere = Ouvriere(0, 0, monde)
   >>> ouvriere
   Ouvriere(x=0, y=0, monde=Monde(hauteur=16, largeur=16))
   >>> print(ouvriere)
   fourmi ouvrière située aux coordonnées (0, 0)

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

.. code-block:: pycon

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

Dans la partie suivante, on approfondit l'ensemble des concepts abordés
dans cette introduction. Bonne lecture !
