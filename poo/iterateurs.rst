.. _iterateur:

Itérateurs
==========

Les itérateurs sont des objets incontournables en Python, ils sont
notamment utilisés lorsque l’on fait une boucle ``for``. Les objets
itérateurs peuvent être créés par des objets itérables. Des itérables
connus sont les listes, les dictionnaires, les tuples, les ``range()``.

L’intérêt principal des itérateurs est leur faible consommation mémoire:
contrairement à un objet conteneur qui prend autant d’espace que
d’objets qu’il contient, un itérateur calcule chaque élément lorsqu’il
est appelé.

**Exemple :** Ce qu’il se passe lorsque l’on fait une boucle ``for``

.. code:: python3

   >>> L = [0, 1, 2, 3, 4] # les listes sont des objets itérables
   >>> for element in L # appelle l'itérateur de l'itérable L
   ...    print(element) # à chaque ligne, appelle l'élément suivant de l'itérateur
   0
   1
   2
   3
   4

Les itérateurs sont implémentés sous forme de classes et doivent
respecter le protocole d’itérateur: deux méthodes spéciales doivent être
implémentées.

``iterateur.__iter__()``
    

   Cette méthode doit retourner l’itérateur lui-même, on peut auparavant
   y effectuer quelques opérations d’initialisation. Appel:

   .. code:: python3

      iter(iterateur)

``iterateur.__next__()``
    

   Cette méthode retourne l’élément suivant dans la séquence de
   l’itérateur. Une fois que le dernier élément a été appelé, lève une
   exception ``StopIteration``. Appel:

   .. code:: python3

      next(iterateur)

Les itérables doivent quant à eux implémenter la méthode ``__iter__()``
qui appelle l’itérateur associé. On l’appelle en faisant
``iter(objet_iterable)``.

**Exemple :** Un incrémenteur

.. code:: python3

   class Incrementor:
       def __init__(self, max):
           self.max = max

       def __iter__(self):
           self. n = 0
           return self

       def __next__(self):
           if self.n <= self.max:
               result = self.n
               self.n += 1
               return result
           else:
               raise StopIteration

On peut maintenant utiliser l’itérateur.

.. code:: pycon

   >>> inc = Incrementor(2)
   >>> iterator = iter(inc)
   >>> next(inc)
   0
   >>> next(inc)
   1
   >>> next(inc)
   2
   >>> next(inc)
   Traceback (most recent call last):
     File "<stdin>", line 1, in <module>
       print(next(iterator))
     File "<stdin>", line 2, in __next__
       raise StopIteration
   StopIteration

On peut aussi utiliser une boucle ``for`` pour itérer notre itérateur.

.. code:: pycon

   >>> for i in Incrementor(5):
   ...    print(i)
   0
   1
   2
   3
   4
   5
