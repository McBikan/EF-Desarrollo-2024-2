class HeuristicaConexion:
    def __init__(self, umbral_carga, iteraciones_espera):
        
        self.umbral_carga = umbral_carga
        self.iteraciones_espera = iteraciones_espera

    def es_valido(self, nodo, iteracion_actual):
       
        if nodo.carga > self.umbral_carga and iteracion_actual < self.iteraciones_espera:
            # Si el nodo tiene carga alta y no se ha esperado lo suficiente, no es válido
            return False
        return True
