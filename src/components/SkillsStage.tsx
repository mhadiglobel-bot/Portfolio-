import s from "./PortfolioSections.module.css";
const paths=[
"M26 32 12 46l14 14m44-28 14 14-14 14M57 23 40 70",
"M20 22h54v43H20z M21 32h52 M45 40l23 12-11 3-5 12z",
"M48 24c-9-12-24-2-22 8-14 2-15 22-4 26-2 13 16 22 26 11V24zm0 0c9-12 24-2 22 8 14 2 15 22 4 26 2 13-16 22-26 11 M30 38l8 6-6 9m34-15-8 6 6 9",
"M20 27c0-14 56-14 56 0s-56 14-56 0zm0 0v36c0 14 56 14 56 0V27M20 40c0 14 56 14 56 0M20 52c0 14 56 14 56 0",
"M17 70h62M23 62V49h10v13m8 0V40h10v22m8 0V31h10v31M19 37l19-14 13 5 21-17m-11 1 11-1-1 11",
"M30 24v48m0-24c23 0 34-5 34-22M25 18a5 5 0 1 0 10 0 5 5 0 1 0-10 0m0 60a5 5 0 1 0 10 0 5 5 0 1 0-10 0m34-58a5 5 0 1 0 10 0 5 5 0 1 0-10 0",
"M18 20h60v22H18zm0 34h60v22H18zM27 31h2m7 0h2m-11 34h2m7 0h2m15-34h16m-16 34h16"
];
export default function SkillsStage({active,title}:{active:number;title:string}){
 return <div className={s.sculpture} aria-label={title}><div className={s.base}/><div key={active} className={s.plaque}><svg viewBox="0 0 96 96" aria-hidden="true"><path d={paths[active]} fill="none" stroke="currentColor" strokeWidth="2.8" strokeLinecap="round" strokeLinejoin="round"/></svg></div></div>;
}
