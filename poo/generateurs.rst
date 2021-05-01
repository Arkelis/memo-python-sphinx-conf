Générateurs
===========

**Plus d’informations :** `L’excellent cours d’Antoine
Rozo <https://zestedesavoir.com/tutoriels/954/notions-de-python-avancees/3-further/1-generators/>`__

Fonction génératrice et mot-clé ``yield``
-----------------------------------------

Les générateurs sont une façon plus simple d’implémenter les itérateurs.
Au lieu de créer une classe avec les deux méthodes du protocole
d’itération, on définit une fonction qui retourne les résultats avec le
mot clé ``yield``. Lorsqu’une fonction possède ce mot-clé, l’appeler
crée un générateur (rien d’autre n’est exécuté). Un générateur est un
itérateur qui possède quelques méthodes supplémentaires (cf. plus bas);
ce sont en quelque sorte des itérateurs upgradés. On appelle par abus de
langage les fonctions qui retournent des générateurs (des fonctions
génératrices ) des générateurs aussi (alors que ce sont de simples
fonctions).

Pour faire le lien avec les itérateurs, on peut réécrire l’exemple
précédent à l’aide d’un générateur.

.. code:: python3

   def incrementor(max):
       n = 0
       while n <= max:
           yield n
           n += 1

On utilise les générateurs comme des itérateurs (les générateurs sont
des itérateurs). Lorsque l’on évalue la méthode ``__next__()`` sur un
générateur (en faisant ``next(generateur)``), celui-ci parcourt la
fonction génératrice jusqu’au premier ``yield`` qu’il rencontre, puis
s’arrête. Lorsque la méthode ``__next__()`` est de nouveau appelée, le
générateur continue le parcours jusqu’au ``yield`` suivant, et ainsi de
suite. Lorsqu’il n’y en a plus, le générateur lève une exception
``StopIteration``.

.. code:: pycon

   >>> gen = incrementor(2)
   >>> next(gen)
   0
   >>> next(gen)
   1
   >>> next(gen)
   2
   >>> next(gen) # Erreur
   StopIteration
   >>> for i in incrementor(2):
   ...    print(i)
   0
   1
   2

On n’appelle pas la méthode ``iter()`` sur un générateur. Ainsi, pour
réinitialiser le générateur, on doit le recréer en appelant une nouvelle
fois la fonction génératrice.

**Remarque :** Distinction entre fonction génératrice et générateur

.. code:: python3

   >>> incrementor
   <function incrementor at 0x00000240AA034D08> # simple fonction
   >>> incrementor(1)
   <generator object incrementor at 0x00000240A9FC74F8> # générateur

Fonctions supplémentaires
-------------------------

En plus du mot-clé ``yield``, on peut utiliser des fonctions
supplémentaires dans les générateurs:

``generateur.send()``
    

   Cette méthode permet de communiquer avec le générateur en lui
   envoyant une valeur. Lorsqu’elle est appelée avec un argument,
   celui-ci est envoyé au ``yield`` actuellement atteint, et le
   générateur reprend le parcours jusqu’au ``yield`` suivant. Ainsi,
   appeler cette méthode consomme une itération ! Lorsqu’on utilise
   cette méthode, il ne faut pas oublier d’affecter ``yield`` à une
   variable, sinon l’argument donné par ``send`` sera perdu.
   Séquentiellement, cela donne:

   #. Le générateur vient d’être créé. On appelle ``__next__()``, le
      générateur parcourt la fonction jusqu’au premier ``yield``.

   #. Le générateur rencontre un ``yield``. Il envoie ce que le
      ``yield`` lui fournit et se met en pause.

   #. Le générateur est à nouveau appelé. Si c’est avec un ``send()``,
      il passe son argument au ``yield`` qui la donne à la variable à
      laquelle il est affecté.

   #. Une fois que c’est fait, le générateur reprend le parcours de la
      fonction jusqu’au ``yield`` suivant, (retour à l’étape 2).

**Exemple :** On reprend l’incrémenteur et on veut pourvoir l’étendre,
c’est à dire lui envoyer un nombre et l’ajouter au maximum initial. Pour
cela, on modifie la fonction génératrice et on ajoute des ``print()``
pour voir comment fonctionne ``send()`` (on utilise les f-strings).

.. code:: python3

   def incrementor(max):
       n = 0
       while n <= max:
           print(f"max_pre : {max}")
           add_max = yield n
           print(f"max_post : {max}")
           print(f"add_max : {add_max}")
           n += 1
           max = max + add_max if add_max else max

Lorsque l’on appelle ``send``, la valeur est stockée dans ``add_max``.
On peut alors étendre l’incrémenteur.

.. code:: pycon

   >>> gen = incrementor(2)
   >>> next(gen)   # Le générateur est appelé, il commence le parcours
   max_pre : 2     # Il rencontre le premier print()
   0               # et un yield : il envoie ce que celui-ci lui fournit...
   >>> next(gen)   # et attend qu'on le rappelle !
   max_post : 2    # il reprend son parcours
   add_max : None  # on voit bien que l'on a rien envoyé au générateur
   max_pre : 2
   1
   >>> next(gen)
   max_post : 2
   add_max : None  # toujours rien...
   max_pre : 2
   2
   >>> gen.send(3) # Le yield retourne à add_max la valeur de send()
   max_post : 2    # le générateur reprend le parcours...
   add_max : 3     # On a bien un add_max de 3 !
   max_pre : 5     # arrivé au while, le max a donc changé, la boucle peut donc continuer !
   3               # et on atteint bien le yield suivant
   >>> next(gen)
   max_post : 5
   add_max : None
   max_pre : 5
   4

En fait, on s’aperçoit que ``next(gen)`` et ``gen.send(None)`` sont
équivalents. On ne peut pas appeler ``send()`` avec autre chose que
``None`` en paramètre avant d’avoir appelé au moins une fois
``__next__()``. En effet, l’affectation se fait par l’intermédiaire du
``yield`` actuel.

``generateur.throw(type[, value, traceback])``
    

   Envoie une exception au générateur. Si celui-ci l’attrape, alors
   retourne également la valeur suivante du générateur.

``generateur.close()``
    

   Envoie une exception au générateur
