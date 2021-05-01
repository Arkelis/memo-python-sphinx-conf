Conteneurs
==========

**Remarque préléminaire :** Pour les méthodes spéciales spécifiques aux
types des parties suivantes, je me base sur le module

Les conteneurs sont des objets voués à contenir d’autres objets. Les
principaux exemples de conteneurs sont les listes, les chaînes de
caractères, les tuples, les dictionnaires ou encore les ensembles. Un
objet est dit conteneur s’il possède la méthode spéciale
``__contains__()``.

``conteneur.__contains__(objet)``
    

   Retourne ``True`` si ``objet`` est présent dans ``conteneur``,
   ``False`` sinon. On appelle cette méthode spéciale comme ceci:

   .. code:: python3

      objet in conteneur

La plupart des conteneurs possèdent une taille. Elle calculée par la
méthode spéciale ``__len__()``.

``conteneur.__len__()``
    

   Retourne la taille du conteneur. Devrait retourner un entier positif
   ou nul. Si cette fonction retourne autre chose, une exception est
   levée. On l’appelle comme ceci:

   .. code:: python3

      len(conteneur)

**Exemples :** Des sized capricieux

.. code:: python3

   class StrSized:
       def __len__(self):
           return 'Ma taille !'

   class NegativeSized:
       def __len__(self):
           return -1

   len(StrSized()) # TypeError: 'str' object cannot be interpreted as an integer
   len(NegativeSized()) # ValueError: __len__() should return >= 0

Notons qu’un objet peut avoir une taille sans pour autant être un
conteneur (on appelle ça un *sized*).

Conteneurs indexables
---------------------

Parmi ces conteneurs se distinguent les conteneurs que l’on peut
indexer. Ce sont les conteneurs sur lesquels on peut utiliser les
crochets ``[]`` pour faire référence à un objet dans le conteneur; on
parle de table de correspondance (*mapping*, non détaillé ici), et de
séquence lorsque les index sont des entiers. Parmi les exemples cités
précédemment, seuls les ensembles ne sont pas indexables. On rend un
objet indexable en implémentant une méthode spéciale.

``indexable.__getitem__(index)``
    

   Retourne l’objet référencé par ``index`` (cet indice peut être
   n’importe quel objet). Appelée en faisant:

   .. code:: python3

      indexable[index]

On peut rendre mutables les objets indexables grâce à deux méthodes
spéciales.

``indexable.__setitem__(index, valeur)``
    

   Assigne la nouvelle ``valeur`` à l’objet référencé par ``index``.
   Appel:

   .. code:: python3

      indexable[index] = valeur

``indexable.__delitem__(index)``
    

   Détruit l’objet référencé par ``index``. Appel:

   .. code:: python3

      del indexable[index]

Objets séquentiels
------------------

Les objets séquentiels sont des objets indexables qui n’acceptent que
des entiers comme index. <a venir : Slices>
