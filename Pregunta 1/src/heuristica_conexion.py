class HeuristicaConexion:
    def __init__(self, umbral_carga, iteraciones_espera):
        """
        Inicializa la heurística con un umbral de carga y el número de iteraciones
        que se deben esperar antes de permitir la conexión con nodos con alta carga.
        
        :param umbral_carga: Umbral de carga sobre el cual no se permite la conexión.
        :param iteraciones_espera: Número de iteraciones a esperar para permitir la conexión.
        """
        self.umbral_carga = umbral_carga
        self.iteraciones_espera = iteraciones_espera

    def es_valido(self, nodo, iteracion_actual):
        """
        Determina si un nodo es válido para ser conectado en la iteración actual,
        considerando la heurística de "conexión tardía".
        
        :param nodo: Nodo a verificar.
        :param iteracion_actual: La iteración actual del algoritmo.
        :return: True si el nodo es válido para la conexión, False en caso contrario.
        """
        if nodo.carga > self.umbral_carga and iteracion_actual < self.iteraciones_espera:
            # Si el nodo tiene carga alta y no se ha esperado lo suficiente, no es válido
            return False
        return True
