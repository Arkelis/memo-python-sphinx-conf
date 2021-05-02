Méthodes spéciales
==================

Python est un langage avec une syntaxe de haut niveau, on le lit (presque)
comme on lit un livre. Derrière cette syntaxe se cachent des méthodes appelées
méthodes spéciales. On les reconnaît par la présence de soulignés qui
encadrent leur nom, c’est le cas de ``__new__()`` et ``__init__()``.

**Exemples :**

.. code:: python3

   ## Syntaxe de haut niveau   ## Méthode spéciale correspondante
   # Listes
   L = [1, 2, 3]
   2 in L                      # L.__contains__(2)
   len(L)                      # L.__len__()

   # Opérations
   objet1 + objet2             # objet1.__add__(objet2)
   objet1 == objet2            # objet1.__eq__(objet2)

   # Conversion en str ou affichage
   print(objet)                # objet.__str__()
   str(objet)                  # objet.__str__()

   # Appel d'une fonction
   fonction()                  # fonction.__call__()

.. admonition:: Référence 

   `Documentation Python 3 <https://docs.python.org/3/reference/datamodel.html#specialnames>`__

Création, initialisation et finalisation
----------------------------------------

.. function:: Objet.__new__(cls[, *args, **kwargs])

   Créateur de l’instance. C’est une méthode statique qui prend en
   premier paramètre obligatoire la classe de l’instance à créer.Cette méthode
   doit renvoyer une nouvelle instance (de ``cls``) ; l'initialiseur est alors
   appelé avec comme argument ``self`` la nouvelle instance créée. Les
   autres paramètres sont passés à la suite.

   Sauf dans certains cas particuliers, on utilise plutôt ``__init__()`` pour
   initialiser un objet. Implémenter ``__new__()`` est utile :

   * lorsque l'on définit des métaclasses ;
   * lorsque l'on veut définir une sous-classe d'un type natif.

   Cette méthode statique est un cas particulier qui ne nécessite pas de
   décorateur ``@staticmethod``.

**Exemple :** On veut définir une sous-classe de ``str`` avec un attribut
``language`` indiquant la langue de la chaîne de caractères. On surcharge
``__new__()`` pour définir un nouveau constructeur qui prendra en paramètres
la chaîne de caractères et le code de langue.

.. code:: python3

   class LangString:
       """str subclass with language attribute."""
       def __new__(cls, string, language):
           instance = super().__new__(cls, string)
           instance.language = language
           return instance
   
   mystr = LangString("Bonjour !", "fr")
   print(mystr) # Bonjour !
   print(mystr.language) # fr

.. function:: Objet.__init__(self[, *args, **kwargs])
    
   Initialiseur de l’instance. C’est ici qu’on initialise les attributs
   de l’instance.

Ces deux méthodes forment le constructeur de l’instance,
elles sont appelées lorsqu’on appelle la classe pour construire un
objet. Si on surcharge ces méthodes, il ne faut pas oublier d’appeler
les méthodes héritées grâce à ``super()``. Dans le cas où la classe
hérite uniquement d’``object``, il n’y a pas besoin d’appeler
``super().__init__()`` car les instances d’``object`` n’ont aucun
attribut (donc il n’y a pas d’initialisation).


.. function:: Objet.__del__(self)
    

   Finaliseur de l’instance. Cette méthode est appelée lorsqu’un objet
   est sur le point d’être détruit, mais n’est pas responsable de sa
   destruction. Lorsqu’on hérite uniquement d'``object``, il n’est pas
   nécessaire d’appeler ``super().__del__()`` car elle ne fait rien. La
   syntaxe ``del variable`` décrémente le nombre de références vers
   l'``objet`` correspondant. Si celui-ci atteint zéro, alors
   ``objet.__del__()`` est appelée.

Représentation et chaîne de caractères d’un objet
-------------------------------------------------

Par défaut, évaluer une instance d'une classe personnalisée dans
l'interpréteur interactif n'affiche pas quelque chose d'explicite :

.. code:: pycon

   >>> class MaClasse:
   >>> ... pass
   >>> ...
   >>> MaClasse()
   <__main__.MaClasse object at 0x7f6b90f7ba00>

On peut définir une méthode pour afficher une meilleure représentation.

.. function:: Objet.__repr__(self)
    
   Appelée par ``repr()``, ou bien lorsqu’on évalue l’objet dans
   l’interpréteur interactif. Cette méthode calcule et renvoie une chaîne de
   caractères ressemblant à une expression permettant de recréer un objet
   semblable (avec les mêmes valeurs d'attributs). Si ce n’est pas possible, elle devrait
   renvoyer une description entre chevrons ``"<description>"``.

**Exemple :** En reprenant l'exemple précédent de ``LangString``, ``mystr``
pourrait avoir comme représentation ``'LangString("Bonjour !", "fr")'``.

Parfois, on veut quelque chose de plus joli destiné à un véritable
affichage (quand on appelle ``print()``). On peut vouloir aussi avoir la
capacité de convertir un objet en une chaîne de caractère avec
``str()``. On doit alors définir une autre méthode spéciale :

.. function:: Objet.__str__(self)
    
   Appelée par ``str()``, ``print()`` et ``format()``. Cette méthode
   renvoie une chaîne de caractère correspondant à la représentation
   informelle de l’objet. Si cette méthode n’est pas définie, alors
   ``__repr__()`` est utilisée à la place.

.. code:: python3

   class MaClasse:
       def __init__(self, attr):
            self.attribut = attr

       def __repr__(self):
           return f"MaClasse(attribut='{self.attribut}')"

       def __str__(self):
           return f"Instance de MaClasse ayant comme attribut {self.attribut}"

   obj = MaClasse("Exemple")
   print(repr(obj)) # MaClasse(attribut='Exemple')
   print(obj) # Instance de MaClasse ayant comme attribut Exemple.

Accès et modification des attributs
-----------------------------------

On a vu précédemment les propriétés qui permettent une sorte
d’encapsulation des attributs. Lorsqu’on veut accéder à un attribut par
la syntaxe ``instance.attr`` Python appelle en premier une méthode
spéciale.

.. function:: Objet.__getattribute__(self, name)
    
   Appelée en premier lorsque l’on veut accéder à un attribut par les
   syntaxes

   .. code:: python3

      objet.attr             # objet.__getattribute__('attr')
      getattr(objet, 'attr') # objet.__getattribute__('attr')

   Cette méthode doit renvoyer l’attribut ``name`` demandé s’il existe
   (ou calculer sa valeur) ou lever une exception ``AttributeError``
   sinon. Dans ce cas, la méthode ``__getattr__()`` est appelée.

   Cette méthode est définie dans la classe ``object``, le mécanisme
   d’accès par défaut aux attributs est le suivant :

   #. ``object.__getattribute__()`` commence par rechercher ``name``
      sous forme de descripteur dans le dictionnaire ``__dict__`` de la classe de
      l’instance (et de ses classes parentes s’il ne trouve pas).

      .. code:: python3

         type(objet).__dict__[name].__get__(objet, type(objet))

   #. ``object.__getattribute__()`` recherche ensuite ``name`` sous
      forme de simple variable dans le dictionnaire ``__dict__`` de
      l’instance, puis dans celui de sa classe si elle ne le trouve pas,
      ainsi que dans celui de chaque classe parente jusqu’à le trouver.

      .. code:: python3

         objet.__dict__[name]        

   #. Si ``object.__getattribute__()`` n’a pas trouvé ``name`` dans
      aucun ``__dict__``, elle lève une exception ``AttributeError``.

   Surcharger cette méthode va donc modifier le mécanisme par défaut.
   Cependant, pour les attributs dont on ne veut pas modifier l’accès,
   il faut penser à appeler la méthode ``__getattribute__()``
   d’``object`` ou de la classe parente. Pour les attributs dont on
   veut modifier le comportement d’accès, il ne faut pas utiliser la
   syntaxe classique ``objet.attr`` car cela va créer une récursivité
   infinie, il faut avoir recours à ``super().__getattribute__()`` ou
   bien accéder directement aux descripteurs ou clé du dictionnaire.

.. function:: Objet.__getattr__(self, name)
    

   Appelée si ``__getattribute__()`` lève une exception
   ``AttributeError``. Par défaut, cette méthode fait la même chose,
   mais c’est ici que l’on peut calculer des attributs dynamiques: des
   attributs qui ne sont pas initialisés mais dont on veut pouvoir
   calculer la valeur.

.. function :: Objet.__setattr__(self, name, value)
    

   Appelée lorsque l’on assigne une valeur à un attribut:

   .. code:: python3

      objet.attr = value            # objet.__setattr__('attr', value)
      setattr(objet, 'attr', value) # objet.__setattr__('attr', value)

   Cette méthode est définie dans la classe ``object``, l’ordre de
   recherche de l’attribut à modifier est le suivant:

   #. Si un descripteur est trouvé, il est utilisé pour modifier la
      valeur de ``name``.

      .. code:: python3

         type(objet).__dict__[name].__set__(objet, value)

   #. Sinon une nouvelle clé est créée dans le ``__dict__`` de
      l’instance avec pour valeur ``value``.

      .. code:: python3

         objet.__dict__[name] = value

   Surcharger cette méthode va donc modifier le mécanisme par défaut.
   Cependant, pour les attributs dont on ne veut pas modifier le
   comportement de modification, il faut penser à appeler la méthode
   ``__setattr__()`` d’``object`` ou de la classe parente. Pour les
   attributs dont on veut surcharger le mécanisme de modification, il y
   a le même problème que pour ``__getattribute__()``, attention de ne
   pas créer de récursivité infinie.

.. function:: Objet.__delattr__(self, name)
    
   Appelée lorsque l’on veut détruire un attribut :

   .. code:: python3

      del objet.attr         # objet.__delattr__('attr')
      delattr(objet, 'attr') # objet.__delattr__('attr')

   Finalise l’attribut avant sa suppression s’il existe et lève une
   exception ``AttributeError`` sinon. Cette méthode doit appeler
   ``super().__delattr__()`` pour éviter une récursivité infinie lors de
   l’appel à la suppression de l’attribut.

**Exemple :** On peut créer une sous classe de ``dict`` pour accéder aux
items par la notation pointée ``dictionaire.item``

.. code:: python3

   class DottedDict(dict):
       def __getattr__(self, name):
           return self[name]
      
       def __setattr__(self, name, value):
           if name in self:
               self[name] = value
           else:
               super().__setattr__(name, value)

   d = DottedDict({"a": 1, "b": 2})
   print(d) # {'a': 1, 'b': 2}
   print(d.a) # 1
   d.a = 2
   print(d) # {'a': 2, 'b': 2}


Surcharges d’opérateur
----------------------

Les surcharges d’opérateur permettent de faire des opérations
arithmétiques avec des objets, c’est-à-dire d’indiquer à Python ce qu’il
faut faire lorsque l’on exécute ``objet1 + objet2``. Ces méthodes
prennent en arguments ``self`` (l’objet 1) et l’objet 2.

================== ====================
Méthode            Appel
================== ====================
``__add__()``      ``objet1 + objet2``
``__sub__()``      ``objet1 - objet2``
``__mul__()``      ``objet1 * objet2``
``__truediv__()``  ``objet1 / objet2``
``__floordiv__()`` ``objet1 // objet2``
``__mod__()``      ``objet1 \% objet2``
================== ====================

Les deux objets ne sont pas nécessairement du même type ! Cependant,
cette opération n’est pas symétrique : le code ``objet + 5`` par exemple
exécute ``objet.__add__(5)``, alors que ``5 + objet`` exécute
``int.__add__(5)``. Pour que l’opération soit symétrique, il faut aussi
définir ces fonctions avec le préfixe ``r`` (par exemple
``__radd__()``).

.. admonition:: Référence

   `Liste des méthodes d'opérateurs dans la documentation Python
   <https://docs.python.org/3/reference/datamodel.html#emulating-numeric-types>`_

Duck typing
-----------

On appelle *duck typing* , en français typage canard , le fait de
reconnaître un type d’objets grâce à leurs méthodes et attributs. Cela
est utile lorsque l’on veut qu’une fonction puisse prendre en paramètre
une certaine catégorie d’objets qui ne sont pas forcément du même type ;
ils partageront cependant des caractéristiques communes qui leur
permettront d’être traités par la fonction.

Par exemple, on peut récupérer la longueur d’une liste avec ``len()`` :

.. code:: pycon

   >>> len([1, 2, 3])
   3

Mais on peut récupérer la longueur de plein d’autres choses :

.. code:: pycon

   >>> len("abc")
   3
   >>> len((1, 2))
   2
   >>> len(range(5))
   5

Tous ses objets sont de types différents : liste, chaîne de caractères,
tuple, ``range`` ; ils partagent cependant quelque chose :

.. code:: pycon

   >>> for obj in [[1, 2, 3], "abc", (1, 2), range(5)]:
   ...     print(obj.__len__())
   ...
   3
   3
   2
   5

Ainsi, ``len()`` accepte tout objet possédant une taille, c’est-à-dire
tout objet implémentant la méthode spéciale ``__len__()``. Les méthodes
spéciales permettent de cette manière d’implémenter une multitude de
comportements aux objets et de les rendre compatibles avec des API
Python : on peut très bien créer un objet sur lequel on peut itérer avec
une boucle ``for`` en implémentant le protocole d’itération, mais aussi
le rendre appelable comme une fonction grâce à la méthode
``__call__()``.

Les parties suivantes décrivent ces catégories d’objets définies selon
les méthodes spéciales implémentées. On appelle parfois protocole
l’ensemble des méthodes spéciales à implémenter pour une catégorie
(exemples : protocole d’itérateur ou protocole de descripteur).
