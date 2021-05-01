.. _sec:descripteur:

Descripteurs
============

Les descripteurs sont une généralisation des propriétés (plus
précisément, les propriétés sont des descripteurs), ce sont des objets
qui doivent implémenter au moins une des méthodes spéciales suivantes:

``Descripteur.__get__(self, inst, owner)``
    

   Appelée lorsqu’on essaie d’accéder à l’attribut:

   .. code:: python3

      inst.descripteur

   ``inst`` est l’instance sur laquelle on essaie d’accéder à l’attribut
   et ``owner`` est le type de ``inst``, la classe propriétaire du
   descripteur. Dans le cas particulier où l’on accède à un attribut par
   la classe:

   .. code:: python3

      Class.descripteur

   ``inst`` vaut ``None`` et ``owner`` est la classe en question.

   Cette méthode doit retourner l’attribut en question ou le calcul de
   sa valeur, ou bien lever une exception ``AttributeError``.

``Descripteur.__set__(self, inst, value)``
    

   Appelée lorsqu’on essaie de modifier la valeur d’un attribut
   d’\ ``inst`` de la classe propriétaire à ``value``:

   .. code:: python3

      inst.descripteur = value

``Descripteur.__delete__(self, inst)``
    

   Appelée lorsqu’on essaie de supprimer l’attribut de ``inst`` de la
   classe propriétaire:

   .. code:: python3

      del inst.descripteur

Les descripteurs sont utiles pour créer des propriétés générales qui
n’ont pas besoin d’en savoir beaucoup sur les classes propriétaires des
attributs et qui peuvent être utilisées par différents types d’objets.

**Exemple :** Un descripteur d’entier borné

.. code:: python3

   class BoundedIntDescriptor:
       """Entier borné.
       
       Vérifie que l'attribut est compris entre mini et maxi.
       """
       
       def __init__(self, mini, maxi, doc=None):
           self.min = mini
           self.max = maxi
           self.__doc__ = doc

       def __get__(self, inst, owner):
           print("--> __get__ du descripteur appelé.")
           return getattr(inst, '_' + self.name)

       def __set__(self, inst, value):
           print("--> __set__ du descripteur appelé.")
           if not self.min <= value <= self.max:
               raise ValueError("{} doit être compris entre {} et {} ({} donné).".format(
                   self.name, self.min, self.max, value
               ))
           setattr(inst, '_' + self.name, value)
       
       def __set_name__(self, owner, name):
           self.name = name


   class Time:
       def __init__(self, h, m, s):
           self.h = h
           self.m = m
           self.s = s

       h = BoundedIntDescriptor(0, 23, "Entier compris entre 0 et 23 représentant les heures.")
       m = BoundedIntDescriptor(0, 59, "Entier compris entre 0 et 59 représentant les minutes.")
       s = BoundedIntDescriptor(0, 59, "Entier compris entre 0 et 59 représentant les secondes.")

       def __repr__(self):
           return "{} h {} min {} s".format(self._h, self._m, self._s)

Le recours aux fonctions ``getattr()`` et ``setattr()`` permet d’accéder
aux attributs des instances concernées. Si on avait stocké l’attribut
dans l’instance du descripteur par exemple avec un ``self.attr`` au lieu
de ``inst._attr``, changer par exemple la valeur de ``h`` pour ``t1``
(cf. l’exemple précédent) aurait affecté ``t2``! En effet, le
descripteur est instancié *au moment où la classe est définie et non à
l’initialisation des instances de celle-ci*. En résumé, tous les
attributs ``h`` pointent vers la même instance de
``BoundedIntDescriptor``, de même pour ``m`` et ``s``.

Pour récupérer le nom de l’attribut afin d’afficher une erreur
explicite, j’ai utilisé la méthode ``__set_name__()``.

``Descripteur.__set_name__(self, owner, name)``
    

   Appelée lors de la création de la classe, c’est-à-dire quand le
   descripteur est instancié. Le nom de l’instance de ``Descripteur``
   est assigné à ``name``.

Jouons avec notre descripteur:

.. code:: pycon

   >>> t1 = Time(1, 2, 3)
   --> __set__ du descripteur appelé.
   --> __set__ du descripteur appelé.
   --> __set__ du descripteur appelé.
   >>> t1
   1 h 2 min 3 s
   >>> t1.h
   --> __get__ du descripteur appelé.
   1
   >>> t1.m
   --> __get__ du descripteur appelé.
   2
   >>> t1.s
   --> __get__ du descripteur appelé.
   3
   >>> t1.h = 6
   --> __set__ du descripteur appelé.
   >>> t1
   6 h 2 min 3 s
   >>> t2 = Time(10, 11, 12)
   --> __set__ du descripteur appelé.
   --> __set__ du descripteur appelé.
   --> __set__ du descripteur appelé.
   >>> t2
   10 h 11 min 12 s
   >>> t1
   6 h 2 min 3 s
   >>> help(t1)
   --> __get__ du descripteur appelé.
   --> __get__ du descripteur appelé.
   --> __get__ du descripteur appelé.

   Help on Time in module __main__ object:

   class Time(builtins.object)
    |  Time(h, m, s)
    |  
    |  Methods defined here:
    |  
    |  __init__(self, h, m, s)
    |      Initialize self.  See help(type(self)) for accurate signature.
    |  
    |  __repr__(self)
    |      Return repr(self).
    |  
    |  ----------------------------------------------------------------------
    |  Data descriptors defined here:
    |  
    |  __dict__
    |      dictionary for instance variables (if defined)
    |  
    |  __weakref__
    |      list of weak references to the object (if defined)
    |  
    |  h
    |      Entier compris entre 0 et 23 représentant les heures.
    |  
    |  m
    |      Entier compris entre 0 et 59 représentant les minutes.
    |  
    |  s
    |      Entier compris entre 0 et 59 représentant les secondes.

   >>> t1.m = -1
   --> __set__ du descripteur appelé.
   Traceback (most recent call last):
       File "<stdin>", line 1, in <module>
       File "<string>", line 19, in __set__
   ValueError: m doit être compris entre 0 et 59 (-1 donné).

À ce stade, on peut se demander quelle solution choisir pour contrôler
les accès aux attributs ou faire des attributs dynamiques: propriétés,
descripteurs, méthodes spéciales ? La réponse est: si on peut faire ce
que l’on veut facilement, ne pas choisir une solution compliquée
inutilement! Une réponse sur StackOverflow (voir Plus d’informations )
propose ceci:

-  La première solution la plus simple: utiliser le mécanisme par défaut
   qui utilise l’attribut spécial ``__dict__`` de l’instance.

-  Si ce mécanisme est insuffisant, par exemple si on veut déclencher
   des calculs ou ajouter de la logique, utiliser les propriétés.

-  Si ce mécanisme est insuffisant, écrire des descripteurs adaptés; on
   vient de voir qu’ils sont utiles pour des propriétés génériques par
   exemple.

-  Si ce mécanisme est inadapté, utiliser ``__getattr__()``; cette
   méthode est utile pour simuler la présence d’attributs. Cette méthode
   n’agit pas sur les attributs existants.

-  En dernier recours, utiliser ``__getattribute__()``; la différence
   avec la solution précédente est que cette méthode est la première
   appelée lorsque l’on accède à un attribut. Ainsi, on a la main sur
   absolument tous les attributs, ce qui peut engendrer des
   comportements indésirables... À utiliser avec précaution, donc.

**Plus d’informations :**

-  `Guide sur les
   descripteurs <https://docs.python.org/fr/3/howto/descriptor.html>`__
   (documentation officielle).

-  `Quand utiliser les propriétés et les méthodes
   spéciales <https://stackoverflow.com/a/22617259/9214306>`__
