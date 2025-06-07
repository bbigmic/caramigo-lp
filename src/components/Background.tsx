import { useRef, useState, useEffect } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'

// Typ stanu poślizgu
interface DriftState {
  drifting: boolean
  t: number // czas od rozpoczęcia poślizgu
}

interface TowState {
  active: boolean
  t: number // czas od startu animacji lawety
  carIndex: number // który samochód zabiera
  carZ: number // pozycja Z rozbitego auta
  carX: number // pozycja X rozbitego auta
}

function Car({ x, z, color, lights, driftState, offroad, visible = true, collisionZ }: { x: number, z: number, color: string, lights: 'front' | 'rear', driftState?: DriftState, offroad?: boolean, visible?: boolean, collisionZ?: number }) {
  // Animacja poślizgu: przesuwanie w bok, obrót
  let driftX = 0
  let driftRot = 0
  const opacity = visible ? 1 : 0
  if (driftState?.drifting || offroad) {
    if (driftState?.drifting) {
      const t = Math.min(driftState.t, 1.5)
      driftX = (x < 0 ? -1.2 : 1.2) * (t / 1.5)
      driftRot = (x < 0 ? -1 : 1) * 1.5 * 2 * Math.PI * (t / 1.5)
    } else if (offroad) {
      driftX = (x < 0 ? -1.2 : 1.2)
      driftRot = (x < 0 ? -1 : 1) * 1.5 * 2 * Math.PI
    }
    return (
      <group position={[x + driftX, 0.05, collisionZ !== undefined ? collisionZ : z]} rotation={[0, driftRot, 0]}>
        {/* Korpus samochodu */}
        <mesh>
          <boxGeometry args={[0.18, 0.06, 0.32]} />
          <meshStandardMaterial color={color} transparent opacity={opacity} />
        </mesh>
        {/* Światła przednie */}
        {lights === 'front' && (
          <>
            <mesh position={[-0.06, 0, 0.18]}>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} transparent opacity={opacity} />
            </mesh>
            <mesh position={[0.06, 0, 0.18]}>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} transparent opacity={opacity} />
            </mesh>
          </>
        )}
        {/* Światła tylne (przód samochodu względem kierunku jazdy do tyłu) */}
        {lights === 'rear' && (
          <>
            <mesh position={[-0.06, 0, 0.18]}>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshStandardMaterial color="#ff2222" emissive="#ff2222" emissiveIntensity={2} transparent opacity={opacity} />
            </mesh>
            <mesh position={[0.06, 0, 0.18]}>
              <sphereGeometry args={[0.025, 12, 12]} />
              <meshStandardMaterial color="#ff2222" emissive="#ff2222" emissiveIntensity={2} transparent opacity={opacity} />
            </mesh>
          </>
        )}
      </group>
    )
  }
  return (
    <group position={[x, 0.05, collisionZ !== undefined ? collisionZ : z]} rotation={[0, 0, 0]}>
      {/* Korpus samochodu */}
      <mesh>
        <boxGeometry args={[0.18, 0.06, 0.32]} />
        <meshStandardMaterial color={color} transparent opacity={opacity} />
      </mesh>
      {/* Światła przednie */}
      {lights === 'front' && (
        <>
          <mesh position={[-0.06, 0, 0.18]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} transparent opacity={opacity} />
          </mesh>
          <mesh position={[0.06, 0, 0.18]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} transparent opacity={opacity} />
          </mesh>
        </>
      )}
      {/* Światła tylne (przód samochodu względem kierunku jazdy do tyłu) */}
      {lights === 'rear' && (
        <>
          <mesh position={[-0.06, 0, 0.18]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#ff2222" emissive="#ff2222" emissiveIntensity={2} transparent opacity={opacity} />
          </mesh>
          <mesh position={[0.06, 0, 0.18]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#ff2222" emissive="#ff2222" emissiveIntensity={2} transparent opacity={opacity} />
          </mesh>
        </>
      )}
    </group>
  )
}

function TowTruck({ z, t, direction }: { z: number, t: number, direction: 'left' | 'right' }) {
  // Laweta jedzie z boku na pobocze, zatrzymuje się, potem odjeżdża
  // t: 0-1.2s – podjazd, 1.2-2.2s – postój, 2.2-3.2s – odjazd
  let towX = direction === 'left' ? -2.5 : 2.5
  if (t < 1.2) {
    towX = (direction === 'left' ? -2.5 : 2.5) + ((direction === 'left' ? 1.3 : -1.3) * (t / 1.2))
  } else if (t < 2.2) {
    towX = direction === 'left' ? -1.2 : 1.2
  } else if (t < 3.2) {
    towX = (direction === 'left' ? -1.2 : 1.2) + ((direction === 'left' ? -1.3 : 1.3) * ((t - 2.2) / 1.0))
  } else {
    towX = direction === 'left' ? -2.5 : 2.5
  }
  return (
    <group position={[towX, 0.12, z]} rotation={[0, direction === 'left' ? Math.PI/2 : -Math.PI/2, 0]}>
      {/* Kabina */}
      <mesh position={[0, 0.12, 0]}>
        <boxGeometry args={[0.2, 0.15, 0.2]} />
        <meshStandardMaterial color="#e24a4a" />
      </mesh>
      {/* Szyba przednia */}
      <mesh position={[0, 0.15, 0.08]}>
        <boxGeometry args={[0.18, 0.1, 0.02]} />
        <meshStandardMaterial color="#88ccff" transparent opacity={0.7} />
      </mesh>
      {/* Platforma */}
      <mesh position={[0, 0.02, -0.15]}>
        <boxGeometry args={[0.22, 0.04, 0.3]} />
        <meshStandardMaterial color="#e0b800" />
      </mesh>
      {/* Rampa */}
      <mesh position={[0, 0.02, -0.35]} rotation={[0.2, 0, 0]}>
        <boxGeometry args={[0.22, 0.02, 0.2]} />
        <meshStandardMaterial color="#e0b800" />
      </mesh>
      {/* Koła */}
      <group rotation={[Math.PI / 2, 0, 0]}>
        <mesh position={[-0.12, 0.06, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.12, 0.06, 0]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[-0.12, 0.06, -0.15]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
        <mesh position={[0.12, 0.06, -0.15]}>
          <cylinderGeometry args={[0.06, 0.06, 0.04, 16]} />
          <meshStandardMaterial color="#333" />
        </mesh>
      </group>
      {/* Symbol L */}
      <mesh position={[0.12, 0.2, 0.05]}>
        <boxGeometry args={[0.04, 0.04, 0.12]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0.16, 0.2, -0.01]}>
        <boxGeometry args={[0.04, 0.04, 0.04]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Światła */}
      <mesh position={[-0.08, 0.12, 0.11]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={2} />
      </mesh>
      <mesh position={[0.08, 0.12, 0.11]}>
        <sphereGeometry args={[0.02, 8, 8]} />
        <meshStandardMaterial color="#ffcc00" emissive="#ffcc00" emissiveIntensity={2} />
      </mesh>
      {/* Samochód na platformie (widoczny tylko podczas powrotu) */}
      {t > 2.2 && (
        <group position={[0, 0.08, -0.15]} rotation={[0, direction === 'left' ? Math.PI/2 : -Math.PI/2, 0]}>
          {/* Korpus samochodu */}
          <mesh>
            <boxGeometry args={[0.18, 0.06, 0.32]} />
            <meshStandardMaterial color="#888" />
          </mesh>
          {/* Światła przednie */}
          <mesh position={[-0.06, 0, 0.18]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
          </mesh>
          <mesh position={[0.06, 0, 0.18]}>
            <sphereGeometry args={[0.025, 12, 12]} />
            <meshStandardMaterial color="#fff" emissive="#fff" emissiveIntensity={2} />
          </mesh>
        </group>
      )}
    </group>
  )
}

function Road() {
  // Stan samochodów: pozycja Z, czy wypadają z trasy, czy już wypadły
  const [drifted, setDrifted] = useState<DriftState[]>([
    { drifting: false, t: 0 },
    { drifting: false, t: 0 },
    { drifting: false, t: 0 },
  ])
  const [offroad, setOffroad] = useState([false, false, false])
  const [offroadZ, setOffroadZ] = useState([0, 0, 0])
  const [collisionZ, setCollisionZ] = useState<number[]>([0, 0, 0])
  const [tow, setTow] = useState<TowState | null>(null)
  const [carVisible, setCarVisible] = useState([true, true, true])
  const [lastCollisionTime, setLastCollisionTime] = useState(0)
  const carsRef = useRef<THREE.Group>(null!)
  // Pozycje startowe Z dla samochodów jadących do przodu
  const startZ = [-10, -13, -16]

  // Efekt: po poślizgu, po 2s, pojawia się laweta
  useEffect(() => {
    offroad.forEach((isOff, i) => {
      if (isOff && !tow && carVisible[i]) {
        setTimeout(() => {
          setTow({ active: true, t: 0, carIndex: i, carZ: offroadZ[i], carX: i === 0 ? -0.4 : i === 1 ? -0.5 : -0.3 })
        }, 2000)
      }
    })
    // eslint-disable-next-line
  }, [offroad, tow, carVisible])

  // Animacja lawety
  useFrame((_, delta) => {
    if (tow && tow.active) {
      setTow(prev => prev ? { ...prev, t: prev.t + delta } : null)
      // Po 2.2s samochód znika (zabrany przez lawetę)
      if (tow.t > 2.2 && carVisible[tow.carIndex]) {
        setCarVisible(v => v.map((val, idx) => idx === tow.carIndex ? false : val))
      }
      // Po 3.2s laweta odjeżdża, samochód wraca na trasę
      if (tow.t > 3.2) {
        setTow(null)
        setCarVisible(v => v.map((val, idx) => idx === tow.carIndex ? true : val))
        setOffroad(v => v.map((val, idx) => idx === tow.carIndex ? false : val))
      }
    }
  })

  useFrame(({ clock }, delta) => {
    if (carsRef.current) {
      const now = clock.getElapsedTime()
      // Pozycje Z samochodów jadących do przodu
      const zPos = startZ.map((z, i) => ((now * (3.5 + i * 1.2)) % 20) - 10)
      // Sprawdzamy kolizje (jeśli dwa są blisko siebie i żaden nie jest w poślizgu ani poza drogą)
      const newDrifted = drifted.map((d) => ({ ...d }))
      const newOffroad = [...offroad]
      const newOffroadZ = [...offroadZ]
      for (let i = 0; i < 3; i++) {
        for (let j = i + 1; j < 3; j++) {
          if (!drifted[i].drifting && !drifted[j].drifting && !offroad[i] && !offroad[j] && 
              Math.abs(zPos[i] - zPos[j]) < 0.5 && // Zwiększony próg kolizji
              now - lastCollisionTime > 5) { // Minimalny czas między kolizjami
            // Jeden z nich wypada z trasy (losowo)
            const toDrift = Math.random() < 0.5 ? i : j
            newDrifted[toDrift] = { drifting: true, t: 0 }
            // Zapamiętaj pozycję Z w miejscu zderzenia
            newOffroadZ[toDrift] = zPos[toDrift]
            setCollisionZ(prev => prev.map((val, idx) => idx === toDrift ? zPos[toDrift] : val))
            setLastCollisionTime(now)
          }
        }
      }
      // Aktualizujemy czas poślizgu i po 1.5s samochód zostaje poza drogą w miejscu końca animacji
      for (let i = 0; i < 3; i++) {
        if (newDrifted[i].drifting) {
          newDrifted[i].t += delta
          if (newDrifted[i].t > 1.5) {
            newDrifted[i] = { drifting: false, t: 0 }
            newOffroad[i] = true
          }
        }
      }
      // Ustawiamy stan driftu, offroadu i offroadZ
      if (JSON.stringify(newDrifted) !== JSON.stringify(drifted)) {
        setDrifted(newDrifted)
      }
      if (JSON.stringify(newOffroad) !== JSON.stringify(offroad)) {
        setOffroad(newOffroad)
      }
      if (JSON.stringify(newOffroadZ) !== JSON.stringify(offroadZ)) {
        setOffroadZ(newOffroadZ)
      }
      // Aktualizujemy pozycje samochodów
      for (let i = 0; i < 3; i++) {
        if (!offroad[i] && !drifted[i].drifting) {
          carsRef.current.children[i].position.z = zPos[i]
        }
      }
      // Samochody jadące do tyłu (prawy pas)
      for (let i = 3; i < 5; i++) {
        const speed = 2.8 + (i - 3) * 0.6
        carsRef.current.children[i].position.z = (10 - (now * speed) % 20)
      }
    }
  })

  return (
    <group>
      {/* Dwa białe pasy boczne */}
      <mesh position={[-0.9, 0, 0]}>
        <boxGeometry args={[0.05, 0.02, 20]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      <mesh position={[0.9, 0, 0]}>
        <boxGeometry args={[0.05, 0.02, 20]} />
        <meshStandardMaterial color="#fff" />
      </mesh>
      {/* Przerywana linia środkowa */}
      {Array.from({ length: 20 }).map((_, i) => (
        <mesh key={i} position={[0, 0, i * 1 - 10]}>
          <boxGeometry args={[0.1, 0.01, 0.5]} />
          <meshStandardMaterial color="#fff" opacity={0.7} transparent />
        </mesh>
      ))}
      {/* Samochody */}
      <group ref={carsRef}>
        {/* Jadące do przodu (lewy pas, białe światła z przodu) */}
        <Car x={-0.4} z={offroad[0] ? offroadZ[0] : -10} color="#888" lights="front" driftState={drifted[0]} offroad={offroad[0]} visible={carVisible[0]} collisionZ={collisionZ[0]} />
        <Car x={-0.5} z={offroad[1] ? offroadZ[1] : -13} color="#bbb" lights="front" driftState={drifted[1]} offroad={offroad[1]} visible={carVisible[1]} collisionZ={collisionZ[1]} />
        <Car x={-0.3} z={offroad[2] ? offroadZ[2] : -16} color="#666" lights="front" driftState={drifted[2]} offroad={offroad[2]} visible={carVisible[2]} collisionZ={collisionZ[2]} />
        {/* Jadące do tyłu (prawy pas, czerwone światła z przodu) */}
        <Car x={0.4} z={10} color="#888" lights="rear" />
        <Car x={0.5} z={13} color="#bbb" lights="rear" />
      </group>
      {/* Laweta */}
      {tow && (
        <TowTruck
          z={tow.carZ}
          t={tow.t}
          direction={tow.carX < 0 ? 'left' : 'right'}
        />
      )}
    </group>
  )
}

export default function Background() {
  const [cameraPosition, setCameraPosition] = useState<[number, number, number]>([2.5, 3, 7])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 768) {
        setCameraPosition([-2.5, 1.5, 7]) // Przesunięcie kamery w lewo dla urządzeń mobilnych
      } else {
        setCameraPosition([2.5, 3, 7]) // Standardowa pozycja dla większych ekranów
      }
    }

    handleResize() // Ustawienie początkowej pozycji
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  return (
    <div className="fixed inset-0 -z-10">
      <Canvas 
        camera={{ position: cameraPosition, fov: 60, rotation: [0, -0.2, 0] }}
        dpr={[1, 2]}
        performance={{ min: 0.5 }}
        gl={{ 
          antialias: false,
          powerPreference: "high-performance",
          alpha: true
        }}
      >
        <ambientLight intensity={0.7} />
        <pointLight position={[0, 3, 0]} intensity={0.7} />
        <Road />
      </Canvas>
    </div>
  )
} 