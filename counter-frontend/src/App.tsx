import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import { TonConnectButton } from '@tonconnect/ui-react'
import { useTonConnect } from './hooks/useTonConnect'
import { useMainContract } from './hooks/useMainContract'


// function App() {
//   const [count, setCount] = useState(0);
//   const { connected } = useTonConnect();
//   const { ..., sendIncrement } = useMainContract();
//   return (
//     <div className='App'>
//       <TonConnectButton />
//       {connected && (
//         <a
//           onClick={() => {
//             sendIncrement();
//           }}
//         >
//           Increment
//         </a>
//       )}
//     </div>
//   )
// }

function App() {
  const {
    contract_address,
    counter_value,
    recent_sender,
    owner_address,
    contract_balance,
    sendIncrement,
  } = useMainContract();
  const { connected } = useTonConnect();

  return (
    <div>
      <div>
        <TonConnectButton />
      </div>
      <div>
        <div className='Card'>
          <b>Our contract Address</b>
          <div className='Hint'>{contract_address?.slice(0, 30) + "..."}</div>
          <b>Our contract Balance</b>
          <div className='Hint'>{contract_balance}</div>
        </div>

        <div className='Card'>
          <b>Counter Value</b>
          <div>{counter_value ?? "Loading..."}</div>
        </div>
      </div>
      {connected && (
        <a
          onClick={() => {
            sendIncrement();
          }}
        >
          Increment
        </a>
      )}
      <div>
      </div>
    </div>
  );
}

export default App;



{/* <div>
  <a href="https://vitejs.dev" target="_blank">
    <img src={viteLogo} className="logo" alt="Vite logo" />
  </a>
  <a href="https://react.dev" target="_blank">
    <img src={reactLogo} className="logo react" alt="React logo" />
  </a>
</div>
<h1>Vite + React</h1>
<div className="card">
  <button onClick={() => setCount((count) => count + 1)}>
    count is {count}
  </button>
  <p>
    Edit <code>src/App.tsx</code> and save to test HMR
  </p>
</div>
<p className="read-the-docs">
  Click on the Vite and React logos to learn more
</p> */}