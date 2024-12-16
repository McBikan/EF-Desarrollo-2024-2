from heuristica_conexion import HeuristicaConexion

class BFSInvertido:
    def __init__(self, grafo, nodo_destino, heuristica):
        self.grafo = grafo
        self.nodo_destino = nodo_destino
        self.heuristica = heuristica

    def buscar_rutas(self, limite_profundidad=10):
        rutas = []
        visitados = set()
        cola = [(self.nodo_destino, [self.nodo_destino], 0)]  # (nodo_actual, ruta_actual, profundidad_actual)

        while cola:
            nodo_actual, ruta_actual, profundidad_actual = cola.pop(0)

            # Si se supera el límite de profundidad, se ignora
            if profundidad_actual > limite_profundidad:
                continue

            # Si el nodo ya fue visitado, se ignora
            if nodo_actual in visitados:
                continue

            visitados.add(nodo_actual)

            # Verifica si los vecinos cumplen con la heurística
            for vecino in self.grafo.get_vecinos(nodo_actual):
                if not self.heuristica.es_valido(vecino, profundidad_actual):
                    continue

                # Genera una nueva ruta y la añade a la cola
                nueva_ruta = [vecino] + ruta_actual
                cola.append((vecino, nueva_ruta, profundidad_actual + 1))

                # Si el vecino es un nodo origen válido, guarda la ruta
                if self.grafo.es_origen(vecino):
                    rutas.append(nueva_ruta)

        return rutas
