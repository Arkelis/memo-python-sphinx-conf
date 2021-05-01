Métaclasses
===========

Principe
--------

[sec:metaclasses] Les métaclasses sont les classes qui instancient
d’autres classes. Par défaut, une seule métaclasse est définie : la
métaclasse ``type``. On s’en rend compte en demandant le type des
classes que l’on crée.

.. code:: pycon

   >>> class MaClasse:
   ...     pass
   ...
   >>> type(MaClasse)
   <class 'type'>

La métaclasse ``type``
----------------------

On sait que passer à ``type()`` un objet renvoie son type, c’est-à-dire
l’objet qui l’a instancié. Mais ``type()`` permet aussi des créer des
types (des classes) à la volée si on lui passe plus d’arguments : un
nom, un itérable contenant ses classes parentes et un dictionnaire
contenant ses attributs.

.. code:: pycon

   >>> MyType = type("MyType", (), {}) # une classe on ne peut plus basique
   >>> MyType()
   <__main__.MyType object at 0x7ff838fb7518>
   >>> issubclass(MyType, object)
   True
   >>> isisntance(MyType, type)
   True

On peut donc créer des fonctions qui créent des classes.

.. code:: python3

   def class_creator(name, bases=(), attrs={}): # il faut garder la signature de type()
       """Créateur de classe personnalisé.

       Celui ajoute à chaque classe créée un identifiant de classe correspondant au
       nombre de classes créées au moment de l'appel de class_creator().
       """
       if not hasattr(class_creator, "increment"):
           class_creator.increment = 0 # on utilise un attribut de fonction
       attrs["class_id"] = class_creator.increment
       class_creator.increment += 1
       return type(name, bases, attrs)

.. code:: pycon

   >>> first = class_creator("first")
   >>> second = class_creator("second")
   >>> first.class_id
   0
   >>> second.class_id
   1
   >>> class Third(metaclass=class_creator):
   ...     pass
   ...
   >>> Third.class_id
   2

Ou plutôt des générateurs de classes :

.. code:: python3

   def class_generator_function(bases=(), attrs={}):
       """Générateur de classe."""
       increment = 0
       name = yield # initialisation
       while True:
           attrs["class_id"] = increment
           name = yield type(name, bases, attrs)
           increment += 1

.. code:: pycon

   >>> class_generator = class_generator_function()
   >>> next(class_generator) # initialisation
   >>> first = class_generator.send("first")
   >>> second = class_generator.send("second")
   >>> first.class_id
   0
   >>> second.class_id
   1

Ecrire une métaclasse
---------------------

On est un peu limité dans le cas de fonctions qui créent des classes.
Pour des choses plus complexes, on peut écrire des classes qui
instancient d’autres classes : des métaclasses.

Pour qu’une classe puisse instancier d’autres classes, il faut hériter
de ``type``. Cela permet notamment d’hériter de sa fonction
``__new__()``. D’habitude (c’est-à-dire quand on hérite simplement de
``object``), cette fonction ne fait rien de spécial, elle retourne
simplement un objet vide que l’on initialise dans ``__init__()``. Dans
le cas de ``type``, c’est cette fonction qui est chargée de créer la
classe. Pour indiquer que l’on est en train de définir une métaclasse,
on écrit ``cls`` au lieu de ``self`` pour faire référence à l’objet
instancié, et ``mcls`` au lieu de ``cls`` pour faire référence au type.

Cette métaclasse ne fait rien de plus que ``type`` :

.. code:: python3

   class SimpleMeta(type):
       def __new__(mcls, name, bases, attrs):
           print(name, "was created.")
           return super().__new__(mcls, name, bases, attrs)

   class ClassUsingSimpleMeta(metaclass=SimpleMeta):
       pass

A l’exécution on verra : \|ClassUsingSimpleMeta was created.\|

Si l’on veut le même comportement que les exemples précédents :

.. code:: python3

   class SimpleMeta(type):
       class_id = 0
       def __init__(cls, name, bases, attrs): # on récupère les arguments de __new__
           super().__init__(name, bases, attrs)
           cls.class_id = cls.class_id
           type(cls).class_id += 1

.. code:: pycon

   >>> class Class0(metaclass=SimpleMeta):
   ...     pass
   ...
   >>> Class2 = SimpleMeta("Class2", (), {})
   >>> Class0.class_id
   0
   >>> Class1.class_id
   1

On peut ajouter des paramètres lors de la déclaration d’une classe :

.. code:: python3

   class AbstractoOrNotAbstractMeta(type):
       def __new__(mcls, name, bases, attrs, abstract=False):
           cls = super().__new__(mcls, name, bases, attrs)
           print(name)
           if abstract:
               def new(cls, *args, **kwargs):
                   raise TypeError("This class is abstract.")
               cls.__new__ = new
           else:
               cls.__new__ = object.__new__
           return cls


   class Abstract(metaclass=AbstractoOrNotAbstractMeta, abstract=True):
       pass

   class Concrete(Abstract):
       pass

   Concrete()
   Abstract() # TypeError

Application des métaclasses : propriété de classe
-------------------------------------------------

On pourrait imaginer des propriétés de classes afin d’ajouter une couche
de logique sur une simple variable de classe. Au lieu de définir un
descripteur générique, on créer une métaclasse qui aura comme propriété
la future propriété de classe.

**Exemple :** Un exemple simple

.. code:: python3

   class ClassPropertyMeta(type):
       def __new__(mcs, name, bases, attrs):
           """Créateur personnalisé.
           
           On redéfinit __new__ pour s'assurer que les éventuels setters des
           propriétés soient appelés.
           """
           cls = super().__new__(mcs, name, bases, {})
           for attr, value in attrs.items():
               setattr(cls, attr, val)
           return cls

       @property
       def some_positive_attr(self):
           return self._propriete

       @some_positive_attr.setter
       def some_positive_attr(self, value):
           if value < 0:
               raise ValueError("some_positive_integer must be > 0.")
           self._propriete = value


   class ClassPropertyOwner(metaclass=ClassPropertyMeta):
       some_positive_attr = -1

Cette définition de classe va lever une exception ``ValueError``. Oui,
une déclaration de classe peut lever une exception.
