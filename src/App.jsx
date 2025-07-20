import { useMemo, useState } from 'react'
import Clicker from './Clicker.jsx'
import People from './People.jsx'

export default function App({ clickersCount, children }) {
  const [count, setCount] = useState(0)
  const [hasClicker, setHasClicker] = useState(true)

  const toggleClickerClick = () => {
    setHasClicker(!hasClicker)
  }

  const increment = () => {
    setCount(count + 1)
  }

  const colors = useMemo(() => {
    const colors = []
    for (let i = 0; i < clickersCount; i++) colors.push(`hsl(${Math.random() * 360}deg, 100%, 75%)`)

    return colors
  }, [clickersCount])

  return (
    <>
      {children}

      <button onClick={toggleClickerClick}>{hasClicker ? 'Hide' : 'Show'} Clicker</button>

      <div>Total count: {count}</div>

      {hasClicker && (
        <>
          {[...Array(clickersCount)].map((value, index) => (
            <Clicker
              key={index}
              increment={increment}
              keyName={`count${index}`}
              color={colors[index]}
            />
          ))}
        </>
      )}

      <People />
    </>
  )
}
