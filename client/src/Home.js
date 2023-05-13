// @ts-nocheck
import React from 'react'

export default function Home() {
  const [entries, setEntries] = React.useState([])

  React.useEffect(
    () =>
      void fetch('/api')
        .then(i => i.json())
        .then(setEntries),
    []
  )

  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <div style={{ display: 'flex', flexDirection: 'column', width: '750px' }}>
        <h2 style={{ alignSelf: 'center' }}>Available autorun entries:</h2>
        {entries.map((i, index) => <Entry {...i} index={index} />)}
        <NewEntry />
      </div>
    </div>
  );
}

/**
 * @param {import('../..').Entry & {index: number}} param0
 */
function Entry({ dir, args, index }) {
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingLeft: '10px',
      borderLeft: '1px solid black',
      margin: '10px 5px'
    }}>
      <div>
        <p style={{ fontSize: 18, margin: 0 }}>{'> '}{args}</p>
        <p style={{ fontSize: 18, margin: 0 }}>{dir}</p>
      </div>
      <div>
        <ToolButton onClick={
          () =>
            fetch('/api/delete?' + new URLSearchParams({ index }))
              .then(i => i.json())
              .then(i => i.error ? alert(JSON.stringify(i)) : document.location.reload())
        }>Delete</ToolButton>
      </div>
    </div>
  )
}

function NewEntry() {
  let [args, setArgs] = React.useState('')
  let [dir, setDir] = React.useState('')

  function onSave() {
    args = args.trim()
    dir = dir.trim()
    const argRegex = /[\w\d._-]+/;
    if (!args.split(' ').every(i => argRegex.test(i))) {
      return alert('invalid args')
    }
    if (!/^\w:/i.test(dir)) {
      return alert('path is not absolute')
    }
    fetch('/api/set?' + new URLSearchParams({ dir, args }))
      .then(i => i.json())
      .then(i => i.error ? alert(JSON.stringify(i)) : document.location.reload())
  }

  return (
    <div style={{
      display: 'flex', margin: '10px 5px', flexDirection: 'column', paddingLeft: '10px',
      borderLeft: '1px solid black', justifyContent: 'space-between', height: 120, width: 300
    }}>
      <h3 style={{ margin: 0 }}>New entry</h3>
      <input placeholder='args' onChange={e => setArgs(e.currentTarget.value)} />
      <input placeholder='dir' onChange={e => setDir(e.currentTarget.value)} />
      <ToolButton style={{ alignSelf: 'start', padding: 0 }} onClick={onSave}>Create</ToolButton>
    </div>
  )
}

function ToolButton({ children, style, onClick }) {
  return (
    <button
      style={{
        fontSize: 16,
        outline: 0,
        border: 0,
        backgroundColor: 'white',
        color: 'grey',
        cursor: 'pointer',
        ...style,
      }}
      onMouseEnter={e => e.currentTarget.style.color = 'darkgrey'}
      onMouseLeave={e => e.currentTarget.style.color = 'grey'}
      onClick={onClick}
    >
      {children}
    </button>
  )
}
