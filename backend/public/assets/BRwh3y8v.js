import{r as a,p as t,T as c}from"./B7DAq_4k.js";const o="courses";async function p(s){try{const e=await a.get(t.join(o),{params:{search:s.search,semester_id:s.semesterId}}),{data:r}=e.data;return r}catch(e){throw new Error(e.message)}}async function d(s){try{const e=await a.get(t.join(o,s)),{data:r}=e.data;return r}catch(e){throw new Error(e.message)}}async function w(s){try{await a.post(t.join(o),s)}catch(e){if(!e.response)throw new Error(e.message);const r=e.response.data.message;if(e.response.data.errors)return Promise.reject(e.response.data.errors);throw new Error(r)}}async function u(s,e){try{const r=c(s);await a.put(t.join(o,e),r,{headers:{"Content-Type":"application/x-www-form-urlencoded"}})}catch(r){if(!r.response)throw new Error(r.message);const n=r.response.data.message;if(r.response.data.errors)return Promise.reject(r.response.data.errors);throw new Error(n)}}async function m(s){try{await a.delete(t.join(o,s))}catch(e){if(!e.response)throw new Error(e.message);const r=e.response.data.message;if(e.response.data.errors)return Promise.reject(e.response.data.errors);throw new Error(r)}}async function h(s,e){try{const r=new URLSearchParams;s.forEach(n=>{r.append("student_ids[]",String(n))}),await a.put(t.join(o,e,"students"),r,{headers:{"Content-Type":"application/x-www-form-urlencoded"}})}catch(r){throw new Error(r.message)}}export{w as a,p as b,h as c,d,m as e,u as f};
