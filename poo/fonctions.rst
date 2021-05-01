.. _sec:callable:

Fonctions et objets callable
============================

Un objet est dit *callable* (que l’on peut traduire par appelable ) si
lui appliquer des parenthèses déclenche quelque chose.

.. code:: python3

   obj() # on appelle l'objet obj
   obj(arg) # on lui passe un argument positionnel
   obj(arg1, param=arg2) # on lui passe aussi un argument nommé
   result = obj() 
   # En général appeler un objet retourne quelque chose. En fait, un callable renvoie toujours
   # au moins None.

**Plus d’informations :**

-  `les
   fonctions <https://docs.python.org/3/reference/datamodel.html#index-32>`__
   (documentation Python 3);

-  `déballage <http://sametmax.com/quest-ce-que-lunpacking-en-python-et-a-quoi-ca-sert/>`__
   et
   `callables <http://sametmax.com/quest-ce-quun-callable-en-python/>`__
   (Sam & Max);

-  `fonctionnement interne des
   callables <https://stackoverflow.com/a/32856533/9214306>`__
   (StackOverflow).

Créer un objet callable
-----------------------

Pour qu’une classe puisse instancier des objets *callable*, il suffit
qu’elle définisse une méthode ``__call__()``.

``Callable.__call__(self[, *args, **kwargs])``
    

   Cette méthode est appelée lorsqu’on appelle un objet. Tout objet
   possédant cette méthode est *callable*.

.. code:: pycon

   >>> class HelloCallable:
   ...     def __call__(self):
   ...         return "Hello"
   ...
   >>> HelloCallable()() # () pour instancier puis () pour appeler
   Hello

Les classes sont *callable*: on les appelle pour instancier.

.. code:: pycon

   >>> class Bar: pass
   ...
   >>> hasattr(Bar, "__call__")
   True

Les objets fonctions
--------------------

Les fonctions et les méthodes sont des objets *callable*, elles sont
créées avec le mot-clé ``def``. On peut utiliser des annotations pour
indiquer les types des paramètres et le type de la valeur renvoyée (les
annotations peuvent être plus généralement n’importe quelle expression
Python).

.. code:: pycon

   >>> def func(arg1: int = 1) -> int:
   ...     """Docstring."""
   ...     return arg1 # l'interpréteur s'arrête au premier return rencontré

Les fonctions sont des objets; à ce titre, on peut parfaitement leur
définir des attributs de fonction. Un exemple farfelu pour montrer que
ça existe:

.. code:: pycon

   >>> def incrementor():
   ...     incrementor.n += 1
   ...     return incrementor.n
   ...
   >>> incrementor.n = -1
   >>> incrementor()
   0
   >>> incrementor()
   1

Ces objets sont des instances de ``function``, ils possèdent quelques
attributs spéciaux:

.. code:: pycon

   >>> type(func)
   <class 'function'>
   >>> func.__name__
   'func'
   >>> func.__module__
   'main'
   >>> func.__annotations__
   {'arg1': <class 'int'>, 'return': <class 'int'>}
   >>> func.__defaults__
   (1,)
   >>> func.__doc__
   'Docstring.'

Les méthodes ont en plus un attribut spécial ``__self__`` et un attribut
spécial ``__func__``. On peut aussi créer une fonction anonyme avec
``lambda``:

.. code:: pycon

   >>> func = lambda x: x # fonction identité (syntaxe -> lambda <args>: <expression à renvoyer>)
   >>> type(func)
   <class 'function'>
   >>> func.__name__
   '<lambda>'

Ce mécanisme est utile si l’on veut créer une fonction à la volée, par
exemple quand on utilise ``map()``.

Gérer les paramètres d’une fonction
-----------------------------------

On peut assigner à certains paramètres une valeur par défaut:

.. code:: pycon

   >>> def function(arg1, arg2=5):
   ...     return arg1 + arg2
   ... 
   >>> function(1)
   6

Les paramètres ayant une valeur par défaut doivent être placé *après*
ceux qui n’en ont pas.

**Remarque :** Les valeurs par défaut sont assignées lors de la
définition de la fonction. Si l’objet associé est muable, la valeur par
défaut restera toujours celle d’origine même si la fonction est appelée
alors que l’objet associé a mué.

On peut passer deux types d’arguments à une fonction:

#. les arguments dits *positionnels*: ils sont interprétés par la
   fonction grâce à leur position dans la liste des arguments passés à
   la fonction;

#. les arguments dits *nommés*: on spécifie le nom de leur paramètre
   quand on les passe à la fonction. On doit avoir passé tous les
   arguments positionnels avant de passer des arguments nommés.

On peut utiliser les opérateurs d’\ *unpacking* (déballage ) :

-  Lorsque l’on écrit les paramètres pour capter tous les paramètres
   possibles.

-  Pour renseigner les arguments.

Cette fonction prend tous les arguments qui lui sont passés:

.. code:: pycon

   >>> def fonction(*args, **kwargs):
   ...     print(locals())
   ...
   >>> fonction(1, 2, 3, 'A', 'B', 'C', kwarg1=4, kwarg2='D')
   {'args': (1, 2, 3, 'A', 'B', 'C'), 'kwargs': {'kwarg1': 4, 'kwarg2': 'D'}}

``*args`` va contenir tous les arguments positionnels dans un tuple et
``**kwargs`` tous les arguments nommés dans un dictionnaire. Cette
syntaxe est utilisée quand on définit une fonction qui en enrobe une
autre pour lui transmettre tous les arguments (voir les ).

On peut aussi utiliser le déballage lors d’appels de fonctions:

.. code:: pycon

   >>> def fonction(par1, par2, par3, par4):
   ...     print(locals())
   ...
   >>> arg1, arg2, arg3, arg4 = 1, 2, 3, 4
   >>> tuple_args = (arg1, arg2)
   >>> dict_args = {'par3': arg3, 'par4': arg4}
   >>> fonction(*tuple_args, **dict_args)
   {'par1': 1, 'par2': 2, 'par3': 3, 'par4': 4}

**Remarque :** Le déballage, ce n’est pas que pour les paramètres de
fonctions:

.. code:: pycon

   >>> L = [1, 2, 3]
   >>> a, b, c = L # on déballe L
   >>> print(a, b, c)
   1 2 3
   >>> char1, char2 = "12" # ça fonctionne pour tout itérable
   >>> print(char1, char2)
   1 2
   >>> a, b = (b, a)
   >>> a, b = b, a # équivalent à la ligne précédente, l'assignation simultanée est en fait du déballage
   >>> d = {'a': 1, 'b': 2, 'c': 3}
   >>> for k, v in d.items():
   ...     print(k, ":", v)
   ... 
   a : 1
   b : 2
   c : 3
