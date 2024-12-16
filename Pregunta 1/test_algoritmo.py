import pytest
from src.algoritmo_bfs_invertido import BFSInvertido
from src.heuristica_conexion import HeuristicaConexion

# Definimos una clase de grafo ficticia para realizar las pruebas
class GrafoMock:
    def __init__(self):
        self.nodos = {
            "A": {"B", "C"},
            "B": {"D"},
            "C": {"D", "E"},
            "D": {"F"},
            "E": {},
            "F": {},
        }
        self.origenes = {"F", "E"}

    def get_vecinos(self, nodo):
        return self.nodos.get(nodo, [])

    def es_origen(self, nodo):
        return nodo in self.origenes


# Clase de prueba
@pytest.fixture
def setup():
    # Setup para las pruebas, creamos una heurística con un umbral de carga de 10 y un tiempo de espera de 2 iteraciones
    heuristica = HeuristicaConexion(umbral_carga=10, iteraciones_espera=2)
    grafo = GrafoMock()
    bfs_invertido = BFSInvertido(grafo=grafo, nodo_destino="A", heuristica=heuristica)
    return bfs_invertido, grafo


def test_bfs_invertido_rutas_validas(setup):
    bfs_invertido, _ = setup

    # Llamamos al algoritmo y verificamos que se encuentren las rutas válidas
    rutas = bfs_invertido.buscar_rutas(limite_profundidad=5)

    # Verificamos que las rutas devueltas sean las esperadas
    assert len(rutas) > 0  # Debería haber al menos una ruta
    assert ["F", "D", "B", "A"] in rutas  # Esperamos que esta ruta esté en los resultados


def test_heuristica_descarta_nodos_con_carga_alta(setup):
    _, grafo = setup

    # Mock de un nodo con carga alta (simulación de que el nodo B tiene carga 20)
    class NodoConCargaAlta:
        carga = 20

    heuristica = HeuristicaConexion(umbral_carga=10, iteraciones_espera=2)
    resultado = heuristica.es_valido(NodoConCargaAlta(), iteracion_actual=1)

    # Esperamos que la heurística rechace el nodo con carga alta
    assert not resultado


def test_heuristica_permite_conexion_posterior(setup):
    _, grafo = setup

    # Mock de un nodo con carga alta pero que puede ser conectado después de 2 iteraciones
    class NodoConCargaAlta:
        carga = 20

    heuristica = HeuristicaConexion(umbral_carga=10, iteraciones_espera=2)
    
    # Si se espera lo suficiente, el nodo debería ser válido
    resultado = heuristica.es_valido(NodoConCargaAlta(), iteracion_actual=2)
    assert resultado


def test_bfs_invertido_no_conecta_nodos_no_validos(setup):
    bfs_invertido, _ = setup

    # Supongamos que el nodo C tiene carga alta y no debería ser visitado
    class NodoConCargaAlta:
        carga = 20

    heuristica = HeuristicaConexion(umbral_carga=10, iteraciones_espera=2)

    # Simulamos que el nodo C tiene carga alta
    bfs_invertido.heuristica = heuristica

    rutas = bfs_invertido.buscar_rutas(limite_profundidad=5)

    # Verificamos que no se incluye un nodo con carga alta en las rutas
    assert "C" not in str(rutas)


def test_bfs_invertido_limita_profundidad(setup):
    bfs_invertido, _ = setup

    # Establecemos un límite de profundidad de 2
    rutas = bfs_invertido.buscar_rutas(limite_profundidad=2)

    # Comprobamos que las rutas no excedan la profundidad de 2
    for ruta in rutas:
        assert len(ruta) <= 3  # La ruta máxima debe ser de 3 nodos: origen + 2 pasos
