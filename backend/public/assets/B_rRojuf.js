import{r as t,p as o}from"./B7DAq_4k.js";const s="role-permissions";async function c(){try{const r=await t.get(o.join(s)),{data:a}=r.data;return a}catch(r){throw new Error(r.message)}}async function p(r){try{const a=await t.get(o.join(s,r)),{data:e}=a.data;return e}catch(a){throw new Error(a.message)}}async function w(r,a){try{const e=new URLSearchParams;a.forEach(n=>{e.append("ids[]",String(n))}),await t.put(o.join(s,r),e,{headers:{"Content-Type":"application/x-www-form-urlencoded"}})}catch(e){throw new Error(e.message)}}export{c as a,p as b,w as c};
