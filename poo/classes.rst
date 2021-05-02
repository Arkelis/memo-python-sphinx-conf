Classes
=======

Les classes permettent des créer des objets appelés instances qui
partagent des caractéristiques communes. Une classe est en fait un
gabarit qui nous permet de créer un certain type d’objets.

.. admonition:: Références

   * `Cours Zeste de Savoir d'Antoine Rozo
     <https://zestedesavoir.com/tutoriels/1253/la-programmation-orientee-objet-en-python/1-object/>`__
   * `Documentation Python 3 <https://docs.python.org/fr/3/tutorial/classes.html>`__

Structure d’une classe
----------------------

Les objets d’une classe partagent des caractéristiques communes à la
classe:

#. des attributs, des variables propres à aux instances;

#. des méthodes, des fonctions propres aux instances et qui agissent par
   exemple sur leurs attributs.

Définition d’une classe et création d’objets
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Pour définir une classe, la syntaxe est la suivante:

.. code:: python3

   class MaClasse:
       ...

Lorsqu’on lance l’exécution d’un module Python, l’interpréteur exécute
le contenu du corps de toutes les classes qu’il rencontre pour la
première fois. Ainsi si l’on exécute :

.. code:: python3

   class Foo:
       print('bar')

La console affichera ``bar``. Pour créer une instance de classe, il faut
appeler la classe. Appeler une classe revient à appeler son , composé
d’un créateur d’objet et d’un initialiseur. En reprenant la classe
``Foo``:

.. code:: pycon

   >>> Foo # évaluation de la classe Foo
   <class '__main__.Foo'>
   >>> Foo() # création d'un objet Foo
   <__main__.Foo object at 0x7f193dd99630>

Attributs
~~~~~~~~~

Créons un objet :

.. code:: pycon

   >>> foo = Foo()

Cet objet est pour l’instant vide, on peut lui donner un attribut:

.. code:: pycon

   >>> foo.attr = 1
   >>> foo.attr
   1

Les informations concernant les attributs d’une instance sont stockées
dans le dictionnaire de l’instance, un attribut spécial nommé
``__dict__``.

.. code:: pycon

   >>> foo.__dict__
   {'attr': 1}

Lorsqu’on accède un attribut avec la syntaxe ``foo.attr``, cette syntaxe
est par défaut équivalente à:

.. code:: pycon

   >>> foo.__dict__['attr']
   1

Pour modifier la valeur d’un attribut, on lui assigne tout simplement
une nouvelle valeur:

.. code:: pycon

   >>> foo.attr = 456
   >>> foo.attr
   456
   >>> foo.__dict__['attr'] = 789 # équivalent
   >>> foo.attr
   789

Une classe peut également définir des attributs de classe:

.. code:: python3

   class Foo:
       class_attr = "I'm a class attribute."

Toutes les instances y ont accès:

.. code:: pycon

   >>> Foo.class_attr
   "I'm a class attribute."
   >>> foo = Foo()
   >>> foo.class_attr
   "I'm a class attribute."

Pourtant, cet attribut n’est pas dans ``foo.__dict__``. En effet,
lorsqu’on accède à un attribut, Python va le rechercher dans le
dictionnaire de l’instance, mais aussi de sa classe s’il ne l’a pas
trouvé. Ainsi:

-  Modifier un attribut de classe pour une instance ajoutera une entrée
   dans son dictionnaire (on n’accède ainsi par la suite plus à
   l’attribut de classe mais au nouvel attribut d’instance, on peut dire
   qu’on l’a surchargé).

-  Modifier un attribut de classe via la classe le modifie pour toutes
   les instances qui ne l’ont pas surchargé, ainsi que pour toutes les
   instances qui seront créées ensuite.

.. code:: pycon

   >>> foo.class_attr = 'New value'
   >>> objet.__dict__
   {'class_attr': 'New value'}
   >>> bar = Foo()
   >>> bar.__dict__
   {}
   >>> Foo.class_attr = "I just got a new value."
   >>> bar.class_attr
   "I just got a new value."
   >>> foo.class_attr
   'New value'

Méthodes
~~~~~~~~

Les méthodes se définissent comme des fonctions dans le corps de la
classe, elles agissent en général sur les instances de la classe. Python
leur passe *toujours* l’instance sur laquelle elles sont appliquées en
premier paramètre. Par convention, il est noté ``self``.

.. code:: python3

   class MaClasse:

       def methode(self, arg1, arg2):
           print(locals())

Ensuite on les appelle de la manière suivante:

.. code:: pycon

   >>> objet = MaClasse()
   >>> objet
   <__main__.MaClasse object at 0x7f13337e50f0>
   >>> objet.methode(arg1, arg2)
   {'self': <__main__.MaClasse object at 0x7f13337e50f0>, 'arg1': 123, 'arg2': 'ABC'}

C’est grâce à cette variable ``self`` que l’on peut agir sur l’instance.

Initialiseur
~~~~~~~~~~~~

L’initialiseur est une méthode spéciale appelée ``__init__()``, il est
appelé lorsqu’une instance vient d’être créée et permet d’en initialiser
les attributs. L’exemple suivant permet d’initialiser deux attributs:

.. code:: python3

   class MaClasse:

       def __init__(self, att1, att2):
           """Initialiseur"""
           self.attribut1 = att1
           self.attribut2 = att2

Ces deux attributs sont initialisés lorsqu’on crée un nouvel objet. Les
valeurs initiales des attributs sont automatiquement passés à
``__init__()`` lorsqu’on appelle la classe pour instancier:

.. code:: pycon

   >>> objet = MaClasse(123, 'ABC')
   >>> objet.__dict__
   {'attribut1': 123, 'attribut2': 'ABC'}

Héritage
--------

Principe
~~~~~~~~

L’héritage est un moyen de créer des classes dérivées (classes filles)
d’une classe de base (classe mère). Une classe fille hérite de toutes
les méthodes et attributs de sa classe mère. Pour indiquer les classes
parentes d’une nouvelle classe, on les indique en paramètres lors de sa
définition. L’héritage en action dans un exemple on ne peut plus simple:

.. code:: pycon

   >>> class Mere:
   ...     attr = 1
   ...
   >>> class Fille(Mere):
   ...     pass
   ...
   >>> Fille().attr
   1

Il est possible de surcharger (d’écraser) une méthode héritée en la
redéfinissant dans la classe fille. Si on veut accéder à une méthode
héritée alors qu’on l’a redéfinie dans la classe fille, on utilise la
fonction ``super()`` qui permet d’appeler la méthode de la classe mère
de la classe présente (sans l’argument ``self``).

**Exemple :**

.. code:: python3

   class Meuble:
       def __init__(self, couleur, materiau):
           self.couleur = couleur
           self.materiau = materiau

   class Bibliotheque(Meuble):
       def __init__(self, couleur, materiau, n):
           super().__init__(couleur, materiau)
           self.nb_livres = n

On peut utiliser deux fonctions pour vérifier l’héritage: ``isinstance``
renvoie ``True`` si l’objet est une instance de la classe ou de ses
classes filles ; ``issubclass`` permet de voir si une classe est fille
d’une autre.

.. code:: pycon

   >>> bibli = Bibliotheque('blanc', 'vert', 150)
   >>> bibli.__dict__
   {'couleur': 'blanc', 'materiau': 'vert', 'nb_livres': 150}
   >>> isinstance(bibli, Meuble)
   True
   >>> isinstance(bibli, Bibliotheque)
   True
   >>> issubclass(Bibliotheque, Meuble)
   True
   >>> issubclass(Meuble, Bibliotheque)
   False
   >>> isinstance(bibli, int)
   False
   >>> isinstance(bibli, object)
   True

.. admonition:: Plus d'informations
   :class: seealso

   * `OpenClassrooms <https://openclassrooms.com/courses/apprenez-a-programmer-en-python/l-heritage-9>`__
   * `Documentation Python
     3 <https://docs.python.org/fr/3/tutorial/classes.html?highlight=héritage#inheritance>`__
   * `Programiz <https://www.programiz.com/python-programming/inheritance>`__

Ordre de résolution de méthode
~~~~~~~~~~~~~~~~~~~~~~~~~~~~~~

Classe mère ``object``
~~~~~~~~~~~~~~~~~~~~~~

On a dit précédemment que le constructeur était composé d’un
initialiseur et d’un créateur d’instance ; cependant l’exemple ne
définissait pas de créateur d’instance : c’est parce qu’il est défini
dans une classe ``object``. Toutes les classes en Python 3 héritent
implicitement de cette classe. Elle définit de nombreuses méthodes,
notamment les méthodes dites spéciales, que l’on peut surcharger pour
les personnaliser.

.. code:: pycon

   >>> object
   <class 'object'>
   >>> help(object)
   Help on class object in module builtins:

   class object
    |  The most base type

   >>> class Foo:
   ...    pass
   ...
   >>> issubclass(Foo, object)
   True

.. _sec:proprietes:

Propriétés
----------

Les propriétés représentent en Python le principe d’encapsulation. Elles
sont utiles si on souhaite contrôler l’accès à un attribut ou si on veut
que le changement d’une valeur d’un attribut engendre des modifications
sur d’autres attributs. Du côté utilisateur, ce mécanisme est
complètement transparent car il permet de garder la syntaxe classique
``inst.attr = valeur``. Les propriétés sont un cas particulier des
descripteurs.

On crée les propriétés en utilisant des décorateurs. Elles contiennent
un accesseur, un mutateur, un destructeur et une aide (docstring de
l’accesseur). Dans certains cas, il n’est pas nécessaire d’avoir un
attribut associé, un simple calcul suffit:

.. code:: python3

   class Temperature:
       def __init__(self, celsius):
           self.celsius = celsius
       
       @property
       def fahrenheit(self):
           """Propriété 'fahrenheit'."""
           return self.celsius * 1.8 + 32
       
       @fahrenheit.setter
       def fahrenheit(self, value):
           self.celsius = (value - 32) / 1.8

Ainsi, on peut écrire:

.. code:: pycon

   >>> temp = Temperature(20)
   >>> temp.fahrenheit
   68.0
   >>> temp.fahrenheit = 69
   >>> temp.celsius
   20.555555555555554

Parfois, il est nécessaire d’ajouter des attributs cachés , par exemple
si l’on veut aussi contrôler le changement de température en degrés
Celsius, pour éviter une récursivité infinie:

.. code:: python3

   class Temperature:
       def __init__(self, celsius):
           self.celsius = celsius
       
       @property
       def celsius(self):
           """Propriété 'celsius'.
           
           Vérifie si la température est supérieure à -273°C avant d'assigner."""
           return self._celsius

       @celsius.setter
       def celsius(self, value):
           if value < -273:
               raise ValueError("Une température en degrés Celsius doit être supérieure à -273°C.")
           self._celsius = value
               
       @property
       def fahrenheit(self):
           """Propriété 'fahrenheit'."""
           return self.celsius * 1.8 + 32

       @fahrenheit.setter
       def fahrenheit(self, value):
           self.celsius = (value - 32) / 1.8

Dans d’autres cas, on peut stocker le résultat de calculs dans un
attribut caché. Ici, le calcul des degrés Fahrenheit est rapide, mais il
peut s’avérer utile de stocker le résultat pour ne pas avoir à
recalculer à chaque fois.

On utilise la propriété de la manière suivante:

.. code:: pycon

   >>> help(Temperature.celsius)
   Help on property:

       Propriété 'celsius'.
       
       Vérifie si la température est supérieure à -273°C avant d'assigner.
       
   >>> temp.celsius = -300
   Traceback (most recent call last):
     File "<stdin>", line 1, in <module>
     File ".../*.py", line 18, in celsius
       raise ValueError("Une température en degrés Celsius doit être supérieure à -273°C.")
   ValueError: Une température en degrés Celsius doit être supérieure à -273°C.
   >>> temp.fahrenheit = -462 # ça marche aussi car cette propriété fait appel à celle des celsius !
   Traceback (most recent call last):
     File "<stdin>", line 1, in <module>
     File ".../*.py", line 18, in celsius
       raise ValueError("Une température en degrés Celsius doit être supérieure à -273°C.")
   ValueError: Une température en degrés Celsius doit être supérieure à -273°C.

.. admonition:: Plus d'informations
   :class: seealso
   
   * `Documentation Python
     3 <https://docs.python.org/fr/3/library/functions.html?highlight=property#property>`__
   * `Priorités entre propriété et méthodes spéciales (Stack Overflow)
     <https://stackoverflow.com/questions/15750522/class-properties-and-setattr/15751159#15751159>`__

Méthodes statiques et méthodes de classes
-----------------------------------------

Méthode statique
~~~~~~~~~~~~~~~~

.. admonition:: Référence
   
   `Documentation Python 3 <https://docs.python.org/3/library/functions.html#staticmethod>`__

Les méthodes que l’on a vues jusqu’à maintenant agissent sur les
instances des classes : elles prennent toujours en premier argument le
mot clé ``self`` qui correspond à l’instance elle même. Lorsque l’on
appelle une telle méthode sur une instance comme ceci :
``instance.methode(*args, **kwargs)`` Python exécute en fait
``type(instance).methode(instance, *args, **kwargs)``.

En fait, ces deux objets sont différents. ``Classe.methode`` est une
simple fonction, alors que ``instance.methode`` est une méthode
partiellement évaluée sur l’instance (méthode liée, en anglais bound
method), c’est-à-dire que l’instance est mise en premier argument.

Parfois, on écrit des méthodes qui n’ont pas d’incidence sur les
instances de la classe. Si l'on reprend la classe ``Temperature``, on
peut envisager d'externaliser le calcul de la température (ici le
calcul est simple, mais on peut extrapoler l'exemple à des choses plus
complexes).

.. code:: python3

   class Temperature:
       def __init__(self, celsius):
           self.celsius = celsius
       
       @property
       def celsius(self):
           """Propriété 'celsius'.
           
           Vérifie si la température est supérieure à -273°C avant d'assigner."""
           return self._celsius

       @celsius.setter
       def celsius(self, value):
           if value < -273:
               raise ValueError("Une température en degrés Celsius doit être supérieure à -273°C.")
           self._celsius = value
               
       @property
       def fahrenheit(self):
           """Propriété 'fahrenheit'."""
           return self.celsius_to_fahrenheit(self.celsius)

       @fahrenheit.setter
       def fahrenheit(self, value):
           self.celsius = self.fahrenheit_to_celsius(value)
      
       def celsius_to_fahrenheit(celsius):
           return celsius * 1.8 + 32
       
       def fahrenheit_to_celsius(fahrenheit):
           return (fahrenheit - 32) / 1.8

Si l'on esssaie cette nouvelle définition, on fait face à une erreur :


.. code:: pycon

   >>> t = Temperature(21)
   >>> t.fahrenheit
   TypeError: celsius_to_fahrenheit() takes 1 positional argument but 2 were given

Le problème étant que Python a en fait exécuté : ``Temperature.celsius_to_fahrenheit(t, 21)``

Pour remédier à cela, il existe le décorateur ``@staticmethod``. Il va permettre d'indiquer
à Python que cette méthode ne prend pas l'instance en premier paramètre.

.. code:: python3

   class Temperature:
      # ...

       @staticmethod
       def celsius_to_fahrenheit(celsius):
           return celsius * 1.8 + 32
       
       @staticmethod
       def fahrenheit_to_celsius(fahrenheit):
           return (fahrenheit - 32) / 1.8

On peut ainsi écrire sans crainte :

.. code:: pycon

   >>> t = Temperature(21)
   >>> t.fahrenheit
   69.80000000000001

Méthode de classe
~~~~~~~~~~~~~~~~~

.. admonition:: Référence
   
   `Documentation Python 3 <https://docs.python.org/3/library/functions.html#classmethod>`__

Parfois, on veut pouvoir agir sur la classe et non sur l’instance. Dans
ce cas, la méthode de classe prend en premier paramètre ``cls`` (la
classe) au lieu de ``self`` (l’instance).

.. code:: pycon

   >>> class Foo:
   ...     CONSTANT = "Bar"
   ...     def print_constant(cls):
   ...         print(cls.CONSTANT)
   ...
   >>> Foo().print_constant()
   Bar

Deux problèmes surviennent. Tout d’abord, même si le premier paramètre
s’appelle ``cls``, c’est encore l’instance qui est mise en paramètre.

.. code:: pycon

   >>> foo = Foo()
   >>> foo.CONSTANT = "Baz"
   >>> foo.print_constant()
   Baz # On veut Bar !

Deuxième problème: on ne peut pas appeler la méthode de classe sur la
classe (même problème que pour les méthodes statiques):

.. code:: pycon

   >>> Foo.print_constant()
   Traceback (most recent call last):
     File "<stdin>", line 1, in <module>
   TypeError: print_constant() missing 1 required positional argument: 'cls'

Pour remédier à cela, on utilise le décorateur ``@classmethod``.

.. code:: pycon

   >>> class Foo:
   ...     CONSTANT = "Bar"
   ...     @classmethod
   ...     def print_constant(cls):
   ...         print(cls.CONSTANT)
   ...
   >>> foo = Foo()
   >>> foo.CONSTANT = "Baz"
   >>> foo.print_constant()
   Bar # Youpi !
   >>> Foo.print_constant()
   Bar # Youyoupi !

Cas de l’héritage
~~~~~~~~~~~~~~~~~

En résumé:

#. Les méthodes statiques sont des fonctions reliées à des classes, mais
   qui n’agissent pas sur celles-ci.

#. Les méthodes de classe sont des fonctions qui prennent la classe en
   paramètre.

Une classe qui hérite d’une classe mère hérite de toutes les méthodes de
celle-ci. Les méthodes statiques restent donc inchangées, tandis que les
méthodes de classe s’adaptent à la nouvelle classe, car elles la
prennent en premier argument.

**Exemple :** Un exemple d’utilisation de méthodes statiques et de
classe sont la création de constructeurs alternatifs. On s’aperçoit de
la différence des deux notions.

.. code:: python3

   class Personne:
       def __init__(self, nom, age):
           self.nom = nom
           self.age = age

       @staticmethod
       def par_date_de_naissance(nom, date):
           return Personne(nom, 2018-date)

       @classmethod
       def par_date_de_naissance2(cls, nom, date):
           return cls(nom, 2018-date)

   class Homme(Personne):
       sexe = 'homme'

.. code:: pycon

   >>> homme1 = Homme.par_date_de_naissance('Jean', 1997)
   >>> homme2 = Homme.par_date_de_naissance2('Jean', 1997)
   >>> type(homme1)
   <class '__main__.Personne'>
   >>> type(homme2)
   <class '__main__.Homme'>

Pour avoir ``homme1`` de type ``Homme``, il faut redéfinir la méthode
statique dans la classe fille.

.. admonition:: Plus d'informations
   :class: seealso
   
   * `Méthode statique sur Programiz
     <https://www.programiz.com/python-programming/methods/built-in/staticmethod>`__
   * `Méthode de classe sur Programiz
     <https://www.programiz.com/python-programming/methods/built-in/classmethod>`__
   * `StackOverflow <https://stackoverflow.com/questions/136097/what-is-the-difference-between-staticmethod-and-classmethod-in-python/1669524#1669524>`__
