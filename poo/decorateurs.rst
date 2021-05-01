.. _sec:decorateur:

Décorateurs
===========

Les décorateurs sont des fonctions ou des classes qui permettent de
modifier le comportement d’une autre fonction (ou classe). Les
décorateurs sont utiles lorsque l’on souhaite qu’un certain nombre de
fonctions effectuent des tâches communes comme par exemple donner leur
temps d’exécution. On appelle un décorateur de la manière suivante.

.. code:: python3

   @decorateur
   def fonction():
       pass

Le code précédent a le même comportement que le code suivant:

.. code:: python3

   def fonction():
       pass

   fonction = decorateur(fonction)

Ainsi, ``fonction`` devient l’objet retournée par
``decorateur(fonction)``. Le décorateur doit donc être un .

**Plus d’informations :** `Stack
Overflow <https://stackoverflow.com/questions/739654/how-to-make-a-chain-of-function-decorators/1594484#1594484>`__

En tant que classe
------------------

Une façon d’implémenter un décorateur est d’utiliser les classes. La
fonction décorée deviendra alors une instance de la classe de ce
décorateur. Il faut obligatoirement définir la méthode ``__call__()``
pour pouvoir rendre cette instance *callable*.

**Exemple :** On considère ici un décorateur qui compte le nombre
d’appels de la fonction décorée.

.. code:: python3

   class Compteur:
       def __init__(self, f):
           self.call = 0
           self.f = f

       def __call__(self, *args, **kwargs):
           self.call += 1
           print("La fonction {} a été appelée {} fois.".format(self.f.__name__, self.call))
           return self.f(*args, **kwargs)

En tant que fonction
--------------------

Comme un décorateur est un objet *callable* qui n’a d’autre utilité que
d’être appelé, il est aussi logique de le définir en tant que fonction.

**Exemple :** Même décorateur que précédemment mais en l’implémentant en
tant que fonction.

.. code:: python3

   def compteur(f):
       def wrapper(*args, **kwargs):
           wrapper.call += 1
           print("La fonction {} a été appelée {} fois.".format(f.__name__, wrapper.call))
           return f(*args, **kwargs)
       wrapper.call = 0
       return wrapper

Dans cet exemple, on assigne à ``wrapper`` un attribut de fonction (on
peut le faire, puisqu’une fonction est un objet – de la classe
``function``). On le définit après avoir défini cette fonction.

Les deux décorateurs précédents donnent ce comportement:

.. code:: pycon

   >>> @compteur
   ... def func():
   ...     return "func got called!"
   ...
   >>> func()
   La fonction func a été appelée 1 fois.
   'func got called!'
   >>> func()
   La fonction func a été appelée 2 fois.
   'func got called!'

Décorateurs à paramètres
------------------------

On peut faire en sorte que le décorateur prenne un ou plusieurs
paramètres. Dans ce cas, il faut définir le décorateur à l’intérieur
d’une clôture qui prend en argument ces différents paramètres.

**Exemple :** On veut retourner une erreur quand la fonction retourne
une valeur trop élevée.

.. code:: python3

   def depasse_max(max):
       def deco(f):
           def wrapper(*args, **kwargs):
               n = f(*args, **kwargs)
               if n > max:
                   print("Maximum {} dépassé.".format(max))
                   return
               return n
           return wrapper
       return deco

Ces deux syntaxes sont équivalentes:

.. code:: python3

   # Syntaxe 1
   @depasse_max(10)
   def demande_nombre():
       n = int(input("Entrer un nombre : "))
       return n

   # Syntaxe 2
   def demande_nombre():
       n = int(input("Entrer un nombre : "))
       return n

   demande_nombre = depasse_max(10)(demande_nombre)

Cela permet de faire

.. code:: pycon

   >>> demande_nombre()
   Entrer un nombre : 11
   Maximum 10 dépassé.
