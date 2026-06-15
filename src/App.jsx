import { useState, useEffect, useMemo, useCallback, useRef } from 'react'
import SEED from './seedData.js'

const C = {
  bg:'#f5f3f8',bg2:'#ede9f5',bg3:'#ffffff',
  border:'#d0c8e0',borderL:'#b8acd0',borderD:'#9080b8',
  text:'rgb(49,31,75)',muted:'rgb(90,65,120)',dim:'rgb(130,110,160)',
  accent:'rgb(110,63,163)',accentL:'rgb(135,78,130)',
  accentGlow:'rgba(110,63,163,0.10)',accentDim:'rgba(110,63,163,0.25)',
  lvlBg:'rgb(110,63,163)',lvlText:'#ffffff',lvlBorder:'rgb(90,43,143)',
  sidebarBg:'rgb(49,31,75)',sidebarText:'#e8dff5',
  sidebarMuted:'rgb(155,120,160)',sidebarBorder:'rgba(255,255,255,0.1)',
}

// ─── Hash Routing ─────────────────────────────────────────────────────────────
const VIEWS = ['matrix','qualifications','jobids','gap']
function getHash() {
  const h = window.location.hash.replace('#/','').replace('#','')
  return VIEWS.includes(h) ? h : null
}
function useHashRouter() {
  const [view,setView] = useState(getHash)
  useEffect(()=>{
    const onHash = ()=>setView(getHash())
    window.addEventListener('hashchange',onHash)
    return ()=>window.removeEventListener('hashchange',onHash)
  },[])
  const navigate = useCallback((v)=>{ window.location.hash='/'+v },[])
  return [view,navigate]
}

// ─── Storage ──────────────────────────────────────────────────────────────────
const STORAGE_KEY = 'qm_v6'
function load() { try { const r=localStorage.getItem(STORAGE_KEY); return r?JSON.parse(r):null } catch{return null} }
function save(d) { try { localStorage.setItem(STORAGE_KEY,JSON.stringify(d)) } catch{} }
function initData() {
  const s=load()
  if(!s) return {qualifications:SEED.qualifications,jobIds:SEED.jobIds,assignments:SEED.assignments}
  return {
    qualifications:s.qualifications??SEED.qualifications,
    jobIds:s.jobIds??SEED.jobIds,
    assignments:{...SEED.assignments,...s.assignments},
  }
}
function useDebouncedSave(data) {
  const t=useRef(null)
  useEffect(()=>{
    if(!data) return
    if(t.current) clearTimeout(t.current)
    t.current=setTimeout(()=>save(data),600)
    return ()=>{ if(t.current) clearTimeout(t.current) }
  },[data])
}

// ─── Confirm Dialog ───────────────────────────────────────────────────────────
function ConfirmDialog({message,onConfirm,onCancel,confirmLabel='Replace'}) {
  return (
    <div style={{position:'fixed',inset:0,zIndex:2000,display:'flex',alignItems:'center',justifyContent:'center',
      background:'rgba(49,31,75,0.4)',backdropFilter:'blur(2px)'}}>
      <div style={{background:C.bg3,border:`1px solid ${C.borderD}`,borderRadius:10,padding:24,
        maxWidth:360,width:'90%',boxShadow:'0 12px 40px rgba(49,31,75,0.2)'}}>
        <div style={{fontSize:14,color:C.text,marginBottom:20,lineHeight:1.6}}>{message}</div>
        <div style={{display:'flex',gap:8,justifyContent:'flex-end'}}>
          <button onClick={onCancel} style={{padding:'7px 16px',borderRadius:6,border:`1px solid ${C.border}`,
            background:'transparent',color:C.muted,fontSize:13,cursor:'pointer',fontFamily:"'DM Sans',sans-serif"}}>Cancel</button>
          <button onClick={onConfirm} style={{padding:'7px 16px',borderRadius:6,border:`1px solid ${C.accent}`,
            background:C.accent,color:'#fff',fontSize:13,cursor:'pointer',fontFamily:"'DM Sans',sans-serif",fontWeight:500}}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  )
}

// ─── Welcome Screen ───────────────────────────────────────────────────────────
function WelcomeScreen({onEnter}) {
  const [hov,setHov]=useState(false)
  return (
    <div style={{position:'fixed',inset:0,zIndex:100,display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',
      background:'radial-gradient(ellipse at 60% 40%, rgb(70,35,110) 0%, rgb(49,31,75) 50%, rgb(28,16,45) 100%)'}}>
      <div style={{position:'absolute',inset:0,pointerEvents:'none',
        backgroundImage:'linear-gradient(rgba(155,120,160,0.04) 1px,transparent 1px),linear-gradient(90deg,rgba(155,120,160,0.04) 1px,transparent 1px)',
        backgroundSize:'40px 40px'}}/>
      <div style={{position:'relative',display:'flex',flexDirection:'column',alignItems:'center'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:32}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:'rgb(155,120,160)'}}/>
          <span style={{fontSize:11,fontFamily:"'DM Mono',monospace",color:'rgba(255,255,255,0.3)',letterSpacing:4}}>KROSCHU</span>
        </div>
        <div style={{fontSize:80,fontWeight:700,letterSpacing:-2,lineHeight:1,color:'#fff',textAlign:'center',marginBottom:16,
          textShadow:'0 0 80px rgba(155,120,160,0.5),0 0 30px rgba(110,63,163,0.4)',fontFamily:"'DM Sans',sans-serif"}}>KroQuAdT</div>
        <div style={{fontSize:14,color:'rgba(255,255,255,0.45)',letterSpacing:1,marginBottom:64,textAlign:'center'}}>
          Kroschu Qualification Administration Tool
        </div>
        <div style={{width:60,height:1,background:'rgba(155,120,160,0.3)',marginBottom:64}}/>
        <button onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={onEnter}
          style={{display:'flex',alignItems:'center',gap:10,padding:'14px 40px',cursor:'pointer',
            background:hov?'rgb(130,80,190)':'rgb(110,63,163)',border:'1px solid rgba(155,120,160,0.4)',
            borderRadius:8,color:'#fff',fontSize:15,fontWeight:600,fontFamily:"'DM Sans',sans-serif",
            letterSpacing:0.5,transition:'all 0.2s',
            boxShadow:hov?'0 0 40px rgba(110,63,163,0.6),0 8px 32px rgba(0,0,0,0.3)':'0 0 20px rgba(110,63,163,0.3),0 4px 16px rgba(0,0,0,0.2)',
            transform:hov?'translateY(-1px)':'translateY(0)'}}>
          Enter <span style={{fontSize:16,opacity:0.8}}>→</span>
        </button>
      </div>
    </div>
  )
}

// ─── Tooltip ──────────────────────────────────────────────────────────────────
function Tooltip({qual,level,anchorRef,visible}) {
  const ref=useRef(null)
  const [pos,setPos]=useState({top:0,left:0})
  useEffect(()=>{
    if(!visible||!anchorRef.current) return
    const r=anchorRef.current.getBoundingClientRect()
    const W=420
    let left=r.right+12; if(left+W>window.innerWidth) left=r.left-W-12
    setPos({top:r.top,left})
    requestAnimationFrame(()=>{
      if(!ref.current) return
      const th=ref.current.offsetHeight
      if(r.top+th>window.innerHeight-16) setPos({top:Math.max(8,r.bottom-th),left})
    })
  },[visible])
  if(!visible) return null
  const desc=qual?.levels?.[String(level)]?.description?.trim()
  return (
    <div ref={ref} style={{position:'fixed',top:pos.top,left:pos.left,zIndex:1000,width:420,
      background:C.bg3,border:`1px solid ${C.borderD}`,borderRadius:10,padding:18,pointerEvents:'none',
      boxShadow:'0 12px 40px rgba(49,31,75,0.20)'}}>
      <div style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:C.accentL,marginBottom:5}}>{qual.id}</div>
      <div style={{fontSize:13,fontWeight:600,color:C.text,marginBottom:12,lineHeight:1.4}}>{qual.name}</div>
      <div style={{display:'flex',alignItems:'center',gap:7,marginBottom:12,paddingBottom:12,borderBottom:`1px solid ${C.border}`}}>
        <div style={{width:24,height:24,borderRadius:4,display:'flex',alignItems:'center',justifyContent:'center',
          background:C.lvlBg,color:'#fff',fontSize:10,fontFamily:"'DM Mono',monospace",fontWeight:700,flexShrink:0}}>L{level}</div>
        <span style={{fontSize:12,color:C.muted,fontWeight:500}}>Level {level} description</span>
      </div>
      <div style={{fontSize:13,color:C.muted,lineHeight:1.8,whiteSpace:'pre-wrap'}}>
        {desc||<span style={{fontStyle:'italic',color:C.dim}}>No description added yet</span>}
      </div>
    </div>
  )
}

// ─── Shared UI ────────────────────────────────────────────────────────────────
function LevelBadgeTooltip({level,qual,size=22}) {
  const [hov,setHov]=useState(false); const ref=useRef(null)
  return (
    <>
      <div ref={ref} onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
        style={{width:size,height:size,borderRadius:4,display:'inline-flex',alignItems:'center',
          justifyContent:'center',fontSize:9,fontFamily:"'DM Mono',monospace",fontWeight:700,
          background:C.lvlBg,color:C.lvlText,border:`1px solid ${C.lvlBorder}`,flexShrink:0,cursor:'default'}}>
        L{level}
      </div>
      <Tooltip qual={qual} level={level} anchorRef={ref} visible={hov}/>
    </>
  )
}

function LevelBadge({level,size=24}) {
  if(!level) return null
  return (
    <div style={{width:size,height:size,borderRadius:4,display:'inline-flex',alignItems:'center',
      justifyContent:'center',fontSize:size<22?9:11,fontFamily:"'DM Mono',monospace",fontWeight:700,
      background:C.lvlBg,color:C.lvlText,border:`1px solid ${C.lvlBorder}`,flexShrink:0}}>L{level}</div>
  )
}

function Btn({children,onClick,variant='ghost',style={}}) {
  const v={ghost:{background:'transparent',borderColor:C.border,color:C.muted},
    primary:{background:C.accent,borderColor:C.accent,color:'#fff'},
    danger:{background:'transparent',borderColor:'#d08090',color:'#a04060'}}
  return <button onClick={onClick} style={{display:'inline-flex',alignItems:'center',gap:6,padding:'6px 14px',
    borderRadius:6,fontSize:13,fontWeight:500,cursor:'pointer',border:'1px solid',
    fontFamily:"'DM Sans',sans-serif",transition:'all 0.12s',...v[variant],...style}}>{children}</button>
}

function Input({value,onChange,placeholder,style={},multiline=false}) {
  const base={background:C.bg3,border:`1px solid ${C.border}`,borderRadius:6,color:C.text,
    padding:'7px 10px',fontSize:13,fontFamily:"'DM Sans',sans-serif",outline:'none',width:'100%',...style}
  if(multiline) return <textarea value={value} onChange={onChange} placeholder={placeholder} style={{...base,resize:'vertical',minHeight:90}}/>
  return <input value={value} onChange={onChange} placeholder={placeholder} style={base}/>
}

function Select({value,onChange,children,style={}}) {
  return <select value={value} onChange={onChange} style={{background:C.bg3,border:`1px solid ${C.border}`,
    borderRadius:6,color:C.text,padding:'7px 10px',fontSize:13,
    fontFamily:"'DM Sans',sans-serif",outline:'none',...style}}>{children}</select>
}

function SectionHeader({children}) {
  return <div style={{fontSize:10,color:C.dim,fontFamily:"'DM Mono',monospace",letterSpacing:1.5,marginBottom:8}}>{children}</div>
}

// ─── Virtual Matrix ───────────────────────────────────────────────────────────
const CELL_W=120,BLOCK_H=136,HEAD_H=80,FROZEN_W=340,BUFFER=3

function VirtualMatrix({qualifications,jobIds,assignments,onToggle}) {
  const containerRef=useRef(null),frozenRef=useRef(null),headRef=useRef(null)
  const [scrollTop,setScrollTop]=useState(0)
  const [scrollLeft,setScrollLeft]=useState(0)
  const [vpH,setVpH]=useState(600),[vpW,setVpW]=useState(800)

  useEffect(()=>{
    const el=containerRef.current; if(!el) return
    const ro=new ResizeObserver(e=>{ const{width,height}=e[0].contentRect; setVpH(height); setVpW(width) })
    ro.observe(el); return()=>ro.disconnect()
  },[])

  const totalH=qualifications.length*BLOCK_H,totalW=jobIds.length*CELL_W
  const firstQual=Math.max(0,Math.floor(scrollTop/BLOCK_H)-BUFFER)
  const lastQual=Math.min(qualifications.length-1,Math.ceil((scrollTop+vpH)/BLOCK_H)+BUFFER)
  const visibleQuals=qualifications.slice(firstQual,lastQual+1)
  const firstJob=Math.max(0,Math.floor(scrollLeft/CELL_W)-BUFFER)
  const lastJob=Math.min(jobIds.length-1,Math.ceil((scrollLeft+vpW)/CELL_W)+BUFFER)
  const visibleJobs=jobIds.slice(firstJob,lastJob+1)

  function onScroll(e) {
    const{scrollTop:st,scrollLeft:sl}=e.target
    setScrollTop(st); setScrollLeft(sl)
    if(frozenRef.current) frozenRef.current.scrollTop=st
    if(headRef.current) headRef.current.scrollLeft=sl
  }

  const jobCounts=useMemo(()=>{
    const c={}
    for(const k of Object.keys(assignments)){
      const p=k.split('_'); const jid=p[p.length-1]; c[jid]=(c[jid]||0)+1
    }
    return c
  },[assignments])

  return (
    <div style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
      {/* Header */}
      <div style={{display:'flex',flexShrink:0,borderBottom:`2px solid ${C.borderD}`,background:C.bg3}}>
        <div style={{width:FROZEN_W,minWidth:FROZEN_W,height:HEAD_H,display:'flex',alignItems:'flex-end',
          padding:'0 14px 10px',borderRight:`2px solid ${C.borderD}`,flexShrink:0}}>
          <span style={{fontSize:10,color:C.dim,fontFamily:"'DM Mono',monospace",letterSpacing:1}}>QUALIFICATION / LEVEL</span>
        </div>
        <div style={{flex:1,overflow:'hidden',position:'relative',height:HEAD_H}}>
          <div ref={headRef} style={{position:'absolute',inset:0,overflowX:'hidden',display:'flex'}}>
            <div style={{width:firstJob*CELL_W,minWidth:firstJob*CELL_W,flexShrink:0}}/>
            {visibleJobs.map(job=>{
              const cnt=jobCounts[job.id]||0
              return (
                <div key={job.id} style={{width:CELL_W,minWidth:CELL_W,height:HEAD_H,flexShrink:0,
                  display:'flex',flexDirection:'column',justifyContent:'center',
                  padding:'6px 8px',borderRight:`1px solid ${C.border}`,overflow:'hidden',background:C.bg3}}>
                  <div style={{display:'flex',alignItems:'center',gap:4,marginBottom:3}}>
                    <span style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:C.accent,
                      whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis',flex:1}}>{job.id}</span>
                    {cnt>0&&<span style={{fontSize:9,fontFamily:"'DM Mono',monospace",flexShrink:0,
                      color:'#fff',background:C.accent,borderRadius:3,padding:'1px 4px'}}>{cnt}</span>}
                  </div>
                  <span style={{fontSize:11,color:C.text,lineHeight:1.3,wordBreak:'break-word',
                    display:'-webkit-box',WebkitLineClamp:3,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{job.function}</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>

      {/* Body */}
      <div style={{flex:1,overflow:'hidden',display:'flex'}}>
        <div style={{width:FROZEN_W,minWidth:FROZEN_W,flexShrink:0,borderRight:`2px solid ${C.borderD}`,overflow:'hidden',position:'relative'}}>
          <div ref={frozenRef} style={{position:'absolute',inset:0,overflowY:'hidden',overflowX:'hidden'}}>
            <div style={{height:firstQual*BLOCK_H}}/>
            {visibleQuals.map((qual,i)=>{
              const qi=firstQual+i
              return (
                <div key={qual.id} style={{height:BLOCK_H,display:'flex',borderBottom:`2px solid ${C.borderL}`,background:qi%2===0?C.bg3:C.bg}}>
                  <div style={{width:300,minWidth:300,display:'flex',flexDirection:'column',justifyContent:'center',
                    padding:'4px 10px',borderRight:`1px solid ${C.border}`,gap:5}}>
                    <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.accent,lineHeight:1.2}}>{qual.id}</span>
                    <span style={{fontSize:12,color:C.text,lineHeight:1.4,wordBreak:'break-word',
                      display:'-webkit-box',WebkitLineClamp:4,WebkitBoxOrient:'vertical',overflow:'hidden'}} title={qual.name}>{qual.name}</span>
                  </div>
                  <div style={{display:'flex',flexDirection:'column',width:40,minWidth:40,borderRight:`1px solid ${C.border}`}}>
                    {[1,2,3,4].map(lvl=>(
                      <div key={lvl} style={{flex:1,display:'flex',alignItems:'center',justifyContent:'center',borderBottom:lvl<4?`1px solid ${C.border}`:'none'}}>
                        <LevelBadgeTooltip level={lvl} qual={qual} size={22}/>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
            <div style={{height:Math.max(0,(qualifications.length-lastQual-1)*BLOCK_H)}}/>
          </div>
        </div>

        <div ref={containerRef} onScroll={onScroll} style={{flex:1,overflow:'auto',position:'relative'}}>
          <div style={{width:totalW,height:totalH,position:'relative'}}>
            {visibleQuals.map((qual,i)=>{
              const qi=firstQual+i
              return (
                <div key={qual.id} style={{position:'absolute',top:qi*BLOCK_H,left:0,right:0,height:BLOCK_H,
                  display:'flex',flexDirection:'column',borderBottom:`2px solid ${C.borderL}`,background:qi%2===0?C.bg3:C.bg}}>
                  {[1,2,3,4].map(lvl=>(
                    <div key={lvl} style={{display:'flex',flex:1,borderBottom:lvl<4?`1px solid ${C.border}`:'none'}}>
                      <div style={{width:firstJob*CELL_W,flexShrink:0}}/>
                      {visibleJobs.map(job=>{
                        const key=`${qual.id}_${lvl}_${job.id}`
                        const assigned=!!assignments[key]
                        return (
                          <div key={job.id} onClick={()=>onToggle(qual.id,lvl,job.id)}
                            style={{width:CELL_W,minWidth:CELL_W,flexShrink:0,display:'flex',alignItems:'center',
                              justifyContent:'center',borderRight:`1px solid ${C.border}`,cursor:'pointer',
                              background:assigned?C.accentGlow:'transparent',transition:'background 0.07s'}}>
                            {assigned&&<span style={{fontSize:13,fontWeight:700,color:C.accent,fontFamily:"'DM Mono',monospace"}}>✓</span>}
                          </div>
                        )
                      })}
                    </div>
                  ))}
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

// ─── Matrix View ──────────────────────────────────────────────────────────────
function MatrixView({data,updateData}) {
  const [qualSearch,setQualSearch]=useState('')
  const [jobSearch,setJobSearch]=useState('')
  const [deptFilter,setDeptFilter]=useState('')
  const [confirm,setConfirm]=useState(null)

  const departments=useMemo(()=>[...new Set(data.jobIds.map(j=>j.department).filter(Boolean))].sort(),[data.jobIds])

  const filteredQuals=useMemo(()=>{
    const q=qualSearch.toLowerCase()
    return data.qualifications.filter(q2=>!qualSearch||q2.id.toLowerCase().includes(q)||q2.name.toLowerCase().includes(q))
  },[data.qualifications,qualSearch])

  const filteredJobs=useMemo(()=>{
    const j=jobSearch.toLowerCase()
    return data.jobIds.filter(job=>
      (!deptFilter||job.department===deptFilter)&&
      (!j||job.id.includes(j)||job.function.toLowerCase().includes(j))
    )
  },[data.jobIds,jobSearch,deptFilter])

  function getAssignedLevel(qualId,jobId) {
    for(const lvl of [1,2,3,4]) { if(data.assignments[`${qualId}_${lvl}_${jobId}`]) return lvl }
    return null
  }

  const handleToggle=useCallback((qualId,level,jobId)=>{
    const existing=getAssignedLevel(qualId,jobId)
    if(existing===level) {
      // same level — confirm before removing
      setConfirm({qualId,newLevel:null,jobId,oldLevel:existing})
    } else if(existing&&existing!==level) {
      // different level — confirm before replacing
      setConfirm({qualId,newLevel:level,jobId,oldLevel:existing})
    } else {
      // nothing assigned — assign immediately
      updateData(d=>({...d,assignments:{...d.assignments,[`${qualId}_${level}_${jobId}`]:true}}))
    }
  },[updateData,data.assignments])

  function doReplace() {
    if(!confirm) return
    const{qualId,newLevel,jobId,oldLevel}=confirm
    updateData(d=>{
      const n={...d.assignments}
      delete n[`${qualId}_${oldLevel}_${jobId}`]
      if(newLevel!==null) n[`${qualId}_${newLevel}_${jobId}`]=true
      return{...d,assignments:n}
    })
    setConfirm(null)
  }

  const confirmQualName=confirm?(data.qualifications.find(q=>q.id===confirm.qualId)?.name||confirm.qualId):''

  return (
    <div style={{display:'flex',flexDirection:'column',height:'100%',overflow:'hidden',background:C.bg}}>
      {confirm&&<ConfirmDialog
        message={confirm.newLevel===null ? `Remove Level ${confirm.oldLevel} from:\n"${confirmQualName}"?` : `Replace Level ${confirm.oldLevel} with Level ${confirm.newLevel} for:\n"${confirmQualName}"?`}
        confirmLabel={confirm.newLevel===null?'Remove':'Replace'}
        onConfirm={doReplace} onCancel={()=>setConfirm(null)}/>}
      <div style={{padding:'10px 16px',borderBottom:`1px solid ${C.border}`,display:'flex',gap:8,
        flexWrap:'wrap',alignItems:'center',background:C.bg3,flexShrink:0}}>
        <Input value={qualSearch} onChange={e=>setQualSearch(e.target.value)} placeholder="Search qualifications…" style={{width:210}}/>
        <Input value={jobSearch} onChange={e=>setJobSearch(e.target.value)} placeholder="Search Job-IDs…" style={{width:160}}/>
        <Select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)} style={{width:200}}>
          <option value="">All departments</option>
          {departments.map(d=><option key={d} value={d}>{d}</option>)}
        </Select>
        <span style={{fontSize:11,color:C.dim,fontFamily:"'DM Mono',monospace"}}>
          {filteredQuals.length} quals · {filteredJobs.length} jobs · {Object.keys(data.assignments).length} assigned
        </span>
      </div>
      <VirtualMatrix qualifications={filteredQuals} jobIds={filteredJobs}
        assignments={data.assignments} onToggle={handleToggle}/>
    </div>
  )
}

// ─── Qualifications View ──────────────────────────────────────────────────────
function QualificationsView({data,updateData}) {
  const [search,setSearch]=useState('')
  const [selected,setSelected]=useState(null)
  const [editing,setEditing]=useState(null)
  const [isNew,setIsNew]=useState(false)

  const filtered=useMemo(()=>{
    const q=search.toLowerCase()
    return data.qualifications.filter(qual=>!q||qual.id.toLowerCase().includes(q)||qual.name.toLowerCase().includes(q)||(qual.owner||'').toLowerCase().includes(q))
  },[data.qualifications,search])

  function blankQual(){return{id:'',name:'',owner:'',prerequisites:'',levels:{'1':{description:'',checklist:''},'2':{description:'',checklist:''},'3':{description:'',checklist:''},'4':{description:'',checklist:''}}}}

  function saveEdit(){
    if(!editing) return
    updateData(d=>{
      if(isNew) return{...d,qualifications:[...d.qualifications,editing]}
      return{...d,qualifications:d.qualifications.map(q=>q.id===editing.id?editing:q)}
    })
    setSelected(editing);setEditing(null)
  }

  function deleteQual(id){
    if(!confirm('Delete this qualification and all its assignments?')) return
    updateData(d=>{
      const a=Object.fromEntries(Object.entries(d.assignments).filter(([k])=>!k.startsWith(id+'_')))
      return{...d,qualifications:d.qualifications.filter(q=>q.id!==id),assignments:a}
    })
    setSelected(null)
  }

  function upd(f,v){setEditing(e=>({...e,[f]:v}))}
  function updL(lvl,v){setEditing(e=>({...e,levels:{...e.levels,[lvl]:{...e.levels[lvl],description:v}}}))}
  const display=editing||selected

  return (
    <div style={{display:'flex',height:'100%',overflow:'hidden',background:C.bg}}>
      <div style={{width:300,borderRight:`1px solid ${C.border}`,display:'flex',flexDirection:'column',overflow:'hidden',flexShrink:0,background:C.bg3}}>
        <div style={{padding:10,borderBottom:`1px solid ${C.border}`,display:'flex',gap:6}}>
          <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{flex:1}}/>
          <Btn variant="primary" onClick={()=>{setEditing(blankQual());setIsNew(true);setSelected(null)}} style={{padding:'6px 10px',whiteSpace:'nowrap'}}>+ New</Btn>
        </div>
        <div style={{overflow:'auto',flex:1}}>
          {filtered.map(qual=>{
            const active=(selected?.id===qual.id&&!editing)||(editing?.id===qual.id)
            return (
              <div key={qual.id} onClick={()=>{setSelected(qual);setEditing(null)}} style={{
                padding:'9px 13px',borderBottom:`1px solid ${C.border}`,cursor:'pointer',
                background:active?C.accentGlow:C.bg3,borderLeft:`3px solid ${active?C.accent:'transparent'}`}}>
                <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:3}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.accent}}>{qual.id}</span>
                  <div style={{display:'flex',gap:2}}>
                    {[1,2,3,4].map(l=><div key={l} style={{width:7,height:7,borderRadius:2,
                      background:qual.levels?.[String(l)]?.description?.trim()?C.accent:C.border}}/>)}
                  </div>
                </div>
                <div style={{fontSize:12,color:C.text,lineHeight:1.4,display:'-webkit-box',WebkitLineClamp:2,WebkitBoxOrient:'vertical',overflow:'hidden'}}>{qual.name}</div>
                {qual.owner&&<div style={{fontSize:11,color:C.dim,marginTop:2}}>{qual.owner}</div>}
              </div>
            )
          })}
        </div>
      </div>
      <div style={{flex:1,overflow:'auto',padding:24}}>
        {!display?(
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',color:C.dim}}>
            <div style={{fontSize:40,marginBottom:12,opacity:0.3}}>◈</div>
            <div style={{fontSize:13}}>Select a qualification or create new</div>
          </div>
        ):(
          <div style={{maxWidth:760}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:20,gap:12}}>
              <div style={{flex:1}}>
                {editing?(
                  <div style={{display:'flex',gap:8,marginBottom:8}}>
                    <Input value={editing.id} onChange={e=>upd('id',e.target.value)} placeholder="Qual ID (e.g. 2-05-001)" style={{width:160,fontFamily:"'DM Mono',monospace"}}/>
                    <Input value={editing.name} onChange={e=>upd('name',e.target.value)} placeholder="Qualification name" style={{flex:1}}/>
                  </div>
                ):(
                  <>
                    <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:C.accent,marginBottom:5}}>{display.id}</div>
                    <div style={{fontSize:20,fontWeight:600,color:C.text}}>{display.name}</div>
                  </>
                )}
              </div>
              <div style={{display:'flex',gap:6,flexShrink:0}}>
                {editing
                  ?<><Btn variant="primary" onClick={saveEdit}>Save</Btn><Btn onClick={()=>setEditing(null)}>Cancel</Btn></>
                  :<><Btn onClick={()=>{setEditing(JSON.parse(JSON.stringify(display)));setIsNew(false)}}>Edit</Btn><Btn variant="danger" onClick={()=>deleteQual(display.id)}>Delete</Btn></>}
              </div>
            </div>
            <div style={{display:'flex',gap:10,marginBottom:22}}>
              {[{label:'OWNER',field:'owner',ph:'Responsible person/dept',flex:1},{label:'PREREQUISITES',field:'prerequisites',ph:'Required qualifications',flex:2}].map(f=>(
                <div key={f.field} style={{flex:f.flex}}>
                  <SectionHeader>{f.label}</SectionHeader>
                  {editing?<Input value={editing[f.field]} onChange={e=>upd(f.field,e.target.value)} placeholder={f.ph}/>
                  :<div style={{fontSize:13,color:C.muted}}>{display[f.field]||'—'}</div>}
                </div>
              ))}
            </div>
            <SectionHeader>LEVEL DESCRIPTIONS</SectionHeader>
            {[1,2,3,4].map(lvl=>{
              const ld=display.levels?.[String(lvl)]
              const desc=ld?.description?.trim()
              return (
                <div key={lvl} style={{marginBottom:10,border:`1px solid ${C.border}`,borderRadius:8,overflow:'hidden'}}>
                  <div style={{display:'flex',alignItems:'center',gap:10,padding:'9px 14px',background:C.bg2,borderBottom:editing||desc?`1px solid ${C.border}`:'none'}}>
                    <LevelBadge level={lvl} size={26}/>
                    <span style={{fontSize:13,fontWeight:600,color:C.text}}>Level {lvl}</span>
                    {!editing&&ld?.checklist&&<span style={{marginLeft:'auto',fontSize:10,color:C.dim,fontFamily:"'DM Mono',monospace"}}>{ld.checklist}</span>}
                  </div>
                  {editing?(
                    <div style={{padding:10,background:C.bg3}}>
                      <Input multiline value={ld?.description||''} onChange={e=>updL(String(lvl),e.target.value)} placeholder={`Describe Level ${lvl} capability…`} style={{minHeight:100,fontSize:13}}/>
                    </div>
                  ):desc?(
                    <div style={{padding:'10px 14px',background:C.bg3,fontSize:13,color:C.muted,whiteSpace:'pre-wrap',lineHeight:1.8}}>{desc}</div>
                  ):(
                    <div style={{padding:'10px 14px',background:C.bg3,fontSize:12,color:C.dim,fontStyle:'italic'}}>No description — click Edit to add</div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Job-IDs View ─────────────────────────────────────────────────────────────
function JobIdsView({data,updateData}) {
  const [search,setSearch]=useState('')
  const [deptFilter,setDeptFilter]=useState('')
  const [selected,setSelected]=useState(null)
  const [editing,setEditing]=useState(null)
  const [isNew,setIsNew]=useState(false)

  const departments=useMemo(()=>[...new Set(data.jobIds.map(j=>j.department).filter(Boolean))].sort(),[data.jobIds])
  const filtered=useMemo(()=>{
    const q=search.toLowerCase()
    return data.jobIds.filter(j=>
      (!deptFilter||j.department===deptFilter)&&
      (!q||j.id.includes(q)||j.function.toLowerCase().includes(q)||j.jobGroup.toLowerCase().includes(q))
    )
  },[data.jobIds,search,deptFilter])

  const jobAssignments=useMemo(()=>{
    if(!selected) return []
    return data.qualifications.flatMap(q=>
      [1,2,3,4].flatMap(lvl=>data.assignments[`${q.id}_${lvl}_${selected.id}`]?[{qual:q,level:lvl}]:[])
    )
  },[selected,data])

  function saveEdit(){
    if(!editing) return
    updateData(d=>{
      if(isNew) return{...d,jobIds:[...d.jobIds,editing]}
      return{...d,jobIds:d.jobIds.map(j=>j.id===editing.id?editing:j)}
    })
    setSelected(editing);setEditing(null)
  }

  function deleteJob(id){
    if(!confirm('Delete this Job-ID and all its assignments?')) return
    updateData(d=>{
      const a=Object.fromEntries(Object.entries(d.assignments).filter(([k])=>!k.endsWith('_'+id)))
      return{...d,jobIds:d.jobIds.filter(j=>j.id!==id),assignments:a}
    })
    setSelected(null)
  }

  const display=editing||selected

  return (
    <div style={{display:'flex',height:'100%',overflow:'hidden',background:C.bg}}>
      <div style={{width:300,borderRight:`1px solid ${C.border}`,display:'flex',flexDirection:'column',overflow:'hidden',flexShrink:0,background:C.bg3}}>
        <div style={{padding:10,borderBottom:`1px solid ${C.border}`,display:'flex',flexDirection:'column',gap:6}}>
          <div style={{display:'flex',gap:6}}>
            <Input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search…" style={{flex:1}}/>
            <Btn variant="primary" onClick={()=>{setEditing({id:'',department:'',jobGroup:'',function:'',jobIdOwner:''});setIsNew(true);setSelected(null)}} style={{padding:'6px 10px'}}>+ New</Btn>
          </div>
          <Select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}>
            <option value="">All departments</option>
            {departments.map(d=><option key={d} value={d}>{d}</option>)}
          </Select>
          <span style={{fontSize:11,color:C.dim,fontFamily:"'DM Mono',monospace"}}>{filtered.length} results</span>
        </div>
        <div style={{overflow:'auto',flex:1}}>
          {filtered.map(job=>{
            const cnt=[1,2,3,4].reduce((a,l)=>a+data.qualifications.filter(q=>data.assignments[`${q.id}_${l}_${job.id}`]).length,0)
            const active=(selected?.id===job.id&&!editing)||(editing?.id===job.id)
            return (
              <div key={job.id} onClick={()=>{setSelected(job);setEditing(null)}} style={{
                padding:'9px 13px',borderBottom:`1px solid ${C.border}`,cursor:'pointer',
                background:active?C.accentGlow:C.bg3,borderLeft:`3px solid ${active?C.accent:'transparent'}`}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.accent}}>{job.id}</span>
                  {cnt>0&&<span style={{fontSize:11,color:C.dim,fontFamily:"'DM Mono',monospace"}}>{cnt}</span>}
                </div>
                <div style={{fontSize:12,color:C.text}}>{job.function||'—'}</div>
                <div style={{fontSize:11,color:C.dim,marginTop:1}}>{job.jobGroup}{job.department?` · ${job.department}`:''}</div>
                {job.jobIdOwner&&<div style={{fontSize:11,color:C.accentL,marginTop:1}}>⊙ {job.jobIdOwner}</div>}
              </div>
            )
          })}
        </div>
      </div>
      <div style={{flex:1,overflow:'auto',padding:24}}>
        {!display?(
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',color:C.dim}}>
            <div style={{fontSize:40,marginBottom:12,opacity:0.3}}>◉</div>
            <div style={{fontSize:13}}>Select a Job-ID or create new</div>
          </div>
        ):(
          <div style={{maxWidth:600}}>
            <div style={{display:'flex',justifyContent:'space-between',alignItems:'flex-start',marginBottom:22}}>
              <div>
                {editing
                  ?<Input value={editing.id} onChange={e=>setEditing({...editing,id:e.target.value})} placeholder="Job-ID number" style={{width:160,fontFamily:"'DM Mono',monospace",fontSize:18}}/>
                  :<div style={{fontFamily:"'DM Mono',monospace",fontSize:24,color:C.accent}}>{display.id}</div>}
              </div>
              <div style={{display:'flex',gap:6}}>
                {editing
                  ?<><Btn variant="primary" onClick={saveEdit}>Save</Btn><Btn onClick={()=>setEditing(null)}>Cancel</Btn></>
                  :<><Btn onClick={()=>{setEditing({...selected,jobIdOwner:selected.jobIdOwner||''});setIsNew(false)}}>Edit</Btn><Btn variant="danger" onClick={()=>deleteJob(display.id)}>Delete</Btn></>}
              </div>
            </div>
            <div style={{display:'grid',gridTemplateColumns:'1fr 1fr',gap:14,marginBottom:24}}>
              {[
                {label:'FUNCTION',field:'function'},
                {label:'JOB GROUP',field:'jobGroup'},
                {label:'DEPARTMENT',field:'department'},
                {label:'JOB-ID OWNER',field:'jobIdOwner'},
              ].map(f=>(
                <div key={f.field}>
                  <SectionHeader>{f.label}</SectionHeader>
                  {editing
                    ?<Input value={editing[f.field]||''} onChange={e=>setEditing({...editing,[f.field]:e.target.value})} placeholder={f.field==='jobIdOwner'?'Responsible person…':''}/>
                    :<div style={{fontSize:13,color:f.field==='jobIdOwner'?C.accent:C.muted,fontWeight:f.field==='jobIdOwner'?500:400}}>{display[f.field]||'—'}</div>}
                </div>
              ))}
            </div>
            {!editing&&jobAssignments.length>0&&(
              <>
                <SectionHeader>ASSIGNED QUALIFICATIONS ({jobAssignments.length})</SectionHeader>
                {jobAssignments.map(({qual,level})=>(
                  <div key={`${qual.id}_${level}`} style={{display:'flex',alignItems:'center',gap:10,padding:'8px 12px',
                    border:`1px solid ${C.border}`,borderRadius:6,marginBottom:5,background:C.bg3}}>
                    <LevelBadge level={level} size={24}/>
                    <div>
                      <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:C.accent}}>{qual.id}</div>
                      <div style={{fontSize:12,color:C.text}}>{qual.name}</div>
                    </div>
                  </div>
                ))}
              </>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Gap View ─────────────────────────────────────────────────────────────────
function GapView({data}) {
  const [jobSearch,setJobSearch]=useState('')
  const [deptFilter,setDeptFilter]=useState('')
  const [selectedJob,setSelectedJob]=useState(null)
  const [compareJob,setCompareJob]=useState(null)

  const departments=useMemo(()=>[...new Set(data.jobIds.map(j=>j.department).filter(Boolean))].sort(),[data.jobIds])
  const filteredJobs=useMemo(()=>{
    const q=jobSearch.toLowerCase()
    return data.jobIds.filter(j=>
      (!deptFilter||j.department===deptFilter)&&
      (!q||j.id.includes(q)||j.function.toLowerCase().includes(q))
    )
  },[data.jobIds,jobSearch,deptFilter])

  const jobQuals=useMemo(()=>{
    if(!selectedJob) return []
    return data.qualifications.flatMap(q=>
      [1,2,3,4].flatMap(lvl=>{
        if(!data.assignments[`${q.id}_${lvl}_${selectedJob.id}`]) return []
        return [{qual:q,level:lvl,hasDesc:!!q.levels?.[String(lvl)]?.description?.trim()}]
      })
    )
  },[selectedJob,data])

  const compareMap=useMemo(()=>{
    if(!compareJob) return {}
    const m={}
    for(const q of data.qualifications)
      for(const lvl of [1,2,3,4])
        if(data.assignments[`${q.id}_${lvl}_${compareJob.id}`]) m[`${q.id}_${lvl}`]=true
    return m
  },[compareJob,data])

  const complete=jobQuals.filter(r=>r.hasDesc).length
  const missing=jobQuals.filter(r=>!r.hasDesc).length

  return (
    <div style={{display:'flex',height:'100%',overflow:'hidden',background:C.bg}}>
      <div style={{width:280,borderRight:`1px solid ${C.border}`,display:'flex',flexDirection:'column',overflow:'hidden',flexShrink:0,background:C.bg3}}>
        <div style={{padding:10,borderBottom:`1px solid ${C.border}`,display:'flex',flexDirection:'column',gap:6}}>
          <SectionHeader>SELECT JOB-ID</SectionHeader>
          <Input value={jobSearch} onChange={e=>setJobSearch(e.target.value)} placeholder="Search…"/>
          <Select value={deptFilter} onChange={e=>setDeptFilter(e.target.value)}>
            <option value="">All departments</option>
            {departments.map(d=><option key={d} value={d}>{d}</option>)}
          </Select>
        </div>
        <div style={{overflow:'auto',flex:1}}>
          {filteredJobs.map(job=>{
            const cnt=data.qualifications.reduce((a,q)=>a+[1,2,3,4].filter(l=>data.assignments[`${q.id}_${l}_${job.id}`]).length,0)
            const active=selectedJob?.id===job.id
            return (
              <div key={job.id} onClick={()=>setSelectedJob(job)} style={{
                padding:'8px 13px',borderBottom:`1px solid ${C.border}`,cursor:'pointer',
                background:active?C.accentGlow:C.bg3,borderLeft:`3px solid ${active?C.accent:'transparent'}`}}>
                <div style={{display:'flex',justifyContent:'space-between',marginBottom:2}}>
                  <span style={{fontFamily:"'DM Mono',monospace",fontSize:11,color:C.accent}}>{job.id}</span>
                  <span style={{fontSize:11,color:C.dim,fontFamily:"'DM Mono',monospace"}}>{cnt}</span>
                </div>
                <div style={{fontSize:12,color:C.text}}>{job.function||'—'}</div>
              </div>
            )
          })}
        </div>
      </div>
      <div style={{flex:1,overflow:'auto',padding:24}}>
        {!selectedJob?(
          <div style={{display:'flex',flexDirection:'column',alignItems:'center',justifyContent:'center',height:'100%',color:C.dim}}>
            <div style={{fontSize:40,marginBottom:12,opacity:0.3}}>◎</div>
            <div style={{fontSize:13}}>Select a Job-ID to analyze its qualification profile</div>
          </div>
        ):(
          <div style={{maxWidth:760}}>
            <div style={{marginBottom:22}}>
              <div style={{fontFamily:"'DM Mono',monospace",fontSize:12,color:C.accent,marginBottom:4}}>{selectedJob.id}</div>
              <div style={{fontSize:20,fontWeight:600,color:C.text}}>{selectedJob.function}</div>
              <div style={{fontSize:12,color:C.muted,marginTop:3}}>{selectedJob.jobGroup} · {selectedJob.department}</div>
              {selectedJob.jobIdOwner&&<div style={{fontSize:12,color:C.accent,marginTop:4}}>⊙ Job-ID Owner: {selectedJob.jobIdOwner}</div>}
            </div>
            <div style={{display:'flex',gap:10,marginBottom:22}}>
              {[{l:'Total required',v:jobQuals.length,c:C.accent},{l:'Descriptions complete',v:complete,c:'rgb(60,140,80)'},{l:'Descriptions missing',v:missing,c:'rgb(180,100,30)'}].map(s=>(
                <div key={s.l} style={{flex:1,padding:'12px 16px',background:C.bg3,border:`1px solid ${C.border}`,borderRadius:8}}>
                  <div style={{fontSize:24,fontWeight:700,color:s.c,fontFamily:"'DM Mono',monospace"}}>{s.v}</div>
                  <div style={{fontSize:11,color:C.dim,marginTop:3}}>{s.l}</div>
                </div>
              ))}
            </div>
            <div style={{display:'flex',gap:8,alignItems:'center',marginBottom:18}}>
              <span style={{fontSize:12,color:C.dim,whiteSpace:'nowrap'}}>Compare with:</span>
              <Select value={compareJob?.id||''} onChange={e=>setCompareJob(data.jobIds.find(j=>j.id===e.target.value)||null)} style={{flex:1,maxWidth:300}}>
                <option value="">— none —</option>
                {data.jobIds.filter(j=>j.id!==selectedJob.id).map(j=><option key={j.id} value={j.id}>{j.id} — {j.function}</option>)}
              </Select>
            </div>
            {jobQuals.map(({qual,level,hasDesc})=>(
              <div key={`${qual.id}_${level}`} style={{display:'flex',alignItems:'center',gap:10,padding:'9px 13px',
                border:`1px solid ${hasDesc?C.border:'rgb(200,150,80)'}`,borderRadius:6,marginBottom:5,
                background:hasDesc?C.bg3:'rgba(200,150,80,0.08)'}}>
                <LevelBadge level={level} size={24}/>
                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontFamily:"'DM Mono',monospace",fontSize:10,color:C.accent}}>{qual.id}</div>
                  <div style={{fontSize:12,color:C.text,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>{qual.name}</div>
                </div>
                {compareJob&&(
                  <div style={{display:'flex',alignItems:'center',gap:4,flexShrink:0}}>
                    <span style={{fontSize:10,color:C.dim}}>{compareJob.id}:</span>
                    {compareMap[`${qual.id}_${level}`]?<LevelBadge level={level} size={22}/>
                    :<span style={{fontSize:11,color:C.dim,fontFamily:"'DM Mono',monospace"}}>—</span>}
                  </div>
                )}
                <span style={{fontSize:11,flexShrink:0,fontFamily:"'DM Mono',monospace",color:hasDesc?'rgb(60,140,80)':'rgb(180,100,30)'}}>
                  {hasDesc?'✓ desc':'⚠ empty'}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

// ─── Sidebar ──────────────────────────────────────────────────────────────────
function Sidebar({view,navigate,data,onLogoClick}) {
  const NAV=[
    {id:'matrix',icon:'⊞',label:'Matrix'},
    {id:'qualifications',icon:'◈',label:'Qualifications'},
    {id:'jobids',icon:'◉',label:'Job-IDs'},
    {id:'gap',icon:'◎',label:'Gap Analysis'},
  ]
  return (
    <aside style={{width:196,minWidth:196,background:C.sidebarBg,display:'flex',flexDirection:'column'}}>
      <div onClick={onLogoClick} title="Back to home" style={{padding:'20px 16px 16px',borderBottom:`1px solid ${C.sidebarBorder}`,cursor:'pointer'}}>
        <div style={{display:'flex',alignItems:'center',gap:8,marginBottom:10}}>
          <div style={{width:7,height:7,borderRadius:'50%',background:'rgb(155,120,160)'}}/>
          <span style={{fontSize:10,fontFamily:"'DM Mono',monospace",color:'rgba(255,255,255,0.3)',letterSpacing:3}}>KROSCHU</span>
        </div>
        <div style={{fontSize:13,fontWeight:700,letterSpacing:0.5,color:'#fff',marginBottom:2}}>KroQuAdT</div>
        <div style={{fontSize:11,color:'rgba(255,255,255,0.3)',lineHeight:1.3}}>Qualification Administration Tool</div>
      </div>
      <nav style={{padding:'10px 8px',flex:1}}>
        {NAV.map(item=>(
          <div key={item.id} onClick={()=>navigate(item.id)} style={{
            display:'flex',alignItems:'center',gap:9,padding:'9px 10px',borderRadius:7,
            cursor:'pointer',marginBottom:2,fontSize:13,transition:'all 0.12s',
            background:view===item.id?'rgba(110,63,163,0.35)':'transparent',
            color:view===item.id?'#fff':C.sidebarMuted,
            border:`1px solid ${view===item.id?'rgba(110,63,163,0.6)':'transparent'}`}}>
            <span style={{fontSize:14}}>{item.icon}</span>{item.label}
          </div>
        ))}
      </nav>
      <div style={{padding:'12px 14px',borderTop:`1px solid ${C.sidebarBorder}`,borderBottom:`1px solid ${C.sidebarBorder}`}}>
        <div style={{fontSize:10,color:'rgba(255,255,255,0.25)',fontFamily:"'DM Mono',monospace",letterSpacing:1.5,marginBottom:8}}>DATABASE</div>
        {[{l:'Qualifications',v:data.qualifications.length},{l:'Job-IDs',v:data.jobIds.length},{l:'Assignments',v:Object.keys(data.assignments).length}].map(s=>(
          <div key={s.l} style={{display:'flex',justifyContent:'space-between',marginBottom:5}}>
            <span style={{fontSize:12,color:C.sidebarMuted}}>{s.l}</span>
            <span style={{fontSize:12,fontFamily:"'DM Mono',monospace",color:'#fff'}}>{s.v}</span>
          </div>
        ))}
      </div>
      <div style={{padding:10}}>
        <Btn onClick={()=>{
          const blob=new Blob([JSON.stringify({qualifications:data.qualifications,jobIds:data.jobIds,assignments:data.assignments},null,2)],{type:'application/json'})
          const a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='qm_export.json';a.click()
        }} style={{width:'100%',justifyContent:'center',fontSize:12,color:C.sidebarMuted,borderColor:'rgba(255,255,255,0.12)'}}>↓ Export JSON</Btn>
      </div>
    </aside>
  )
}

// ─── App ──────────────────────────────────────────────────────────────────────
export default function App() {
  const [data,setData]=useState(null)
  const [view,navigate]=useHashRouter()
  const [showWelcome,setShowWelcome]=useState(false)

  useEffect(()=>{ setData(initData()) },[])

  useEffect(()=>{
    const h=window.location.hash
    if(!h||h===''||h==='#'||h==='#/') setShowWelcome(true)
  },[])

  function handleEnter() { setShowWelcome(false); navigate('matrix') }
  function handleLogoClick() { setShowWelcome(true); window.location.hash='' }

  const updateData=useCallback(updater=>{
    setData(prev=>{ if(!prev) return prev; return updater(prev) })
  },[])

  useDebouncedSave(data)

  if(!data) return (
    <div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100vh',flexDirection:'column',gap:16,background:C.sidebarBg}}>
      <div style={{width:40,height:40,border:'2px solid rgba(155,120,160,0.3)',borderTop:'2px solid rgb(110,63,163)',borderRadius:'50%',animation:'spin 0.8s linear infinite'}}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
      <p style={{color:'rgba(255,255,255,0.4)',fontFamily:"'DM Mono',monospace",fontSize:13}}>Loading KroQuAdT…</p>
    </div>
  )

  return (
    <div style={{display:'flex',height:'100vh',overflow:'hidden',background:C.bg}}>
      <style>{`
        ::-webkit-scrollbar{width:10px;height:10px}
        ::-webkit-scrollbar-track{background:${C.bg2}}
        ::-webkit-scrollbar-thumb{background:${C.borderD};border-radius:5px}
        ::-webkit-scrollbar-thumb:hover{background:${C.accent}}
        *{scrollbar-width:auto;scrollbar-color:${C.borderD} ${C.bg2}}
      `}</style>
      {showWelcome&&<WelcomeScreen onEnter={handleEnter}/>}
      <Sidebar view={view} navigate={navigate} data={data} onLogoClick={handleLogoClick}/>
      <main style={{flex:1,overflow:'hidden',display:'flex',flexDirection:'column'}}>
        {view==='matrix'&&<MatrixView data={data} updateData={updateData}/>}
        {view==='qualifications'&&<QualificationsView data={data} updateData={updateData}/>}
        {view==='jobids'&&<JobIdsView data={data} updateData={updateData}/>}
        {view==='gap'&&<GapView data={data}/>}
        {!view&&<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:C.dim,fontSize:13}}>Select a section from the sidebar</div>}
      </main>
    </div>
  )
}
