const VERSION = "k-law-dictionary-v1";
const TERMS = [
{term:"اقاله",definition:"برهم‌زدن قرارداد با توافق دو طرف پس از انعقاد آن.",note:"در اقاله، اراده مشترک طرفین برای انحلال قرارداد لازم است.",basis:"مواد ۲۸۳ به بعد قانون مدنی؛ متن رسمی باید بررسی شود.",aliases:["تفاسخ"]},
{term:"فسخ",definition:"انحلال یک‌جانبه قرارداد بر پایه حق قانونی یا قراردادی.",note:"فسخ با اراده صاحب خیار و در حدود حق فسخ اعمال می‌شود.",basis:"مقررات خیارات در قانون مدنی." ,aliases:["خیار فسخ"]},
{term:"انفساخ",definition:"از بین رفتن قرارداد به حکم قانون یا تحقق شرط فاسخ، بدون نیاز به توافق تازه طرفین.",note:"سبب قانونی یا قراردادی انفساخ باید احراز شود.",basis:"حسب مورد، قانون یا شرط قراردادی."},
{term:"بطلان",definition:"بی‌اعتباری حقوقی عمل از زمان ایجاد، به علت فقدان شرط اساسی صحت یا وجود مانع قانونی.",note:"اثر و شرایط بطلان باید با نوع عمل حقوقی سنجیده شود.",basis:"از جمله مواد ۱۹۰ و مقررات مرتبط قانون مدنی."},
{term:"عدم نفوذ",definition:"عمل حقوقی که اثر نهایی آن متوقف بر اجازه شخص دارای حق است.",note:"عدم نفوذ با بطلان یا عدم قابلیت استناد یکسان نیست.",basis:"حسب مورد، از جمله مقررات معامله فضولی."},
{term:"ضمان درک",definition:"مسئولیت فروشنده در برابر مستحق‌للغیر درآمدن مبیع و آثار قانونی آن.",note:"علم یا جهل فروشنده و خریدار و آثار مالی باید جداگانه بررسی شود.",basis:"مواد ۳۹۰ و ۳۹۱ قانون مدنی."},
{term:"مرور زمان",definition:"گذشت مدت قانونی که در برخی حوزه‌ها بر امکان استماع دعوا یا تعقیب اثر می‌گذارد.",note:"وجود و اثر آن در حقوق مدنی، کیفری و اسناد تجاری یکسان نیست.",basis:"فقط با تعیین موضوع و قانون خاص بررسی شود."},
{term:"اعتبار امر مختوم",definition:"اثر رأی قطعی در جلوگیری از رسیدگی مجدد به دعوایی که شرایط قانونی امر مختوم را دارد.",note:"وحدت اصحاب، موضوع و سبب و سایر شرایط قانونی باید احراز شود.",basis:"مقررات آیین دادرسی مربوط."},
{term:"قرار تأمین خواسته",definition:"تصمیم قضایی برای توقیف مال یا حفظ امکان اجرای حکم در حدود قانون.",note:"فوریت، شرایط صدور، تأمین احتمالی و اعتراض باید بررسی شود.",basis:"مواد ۱۰۸ به بعد قانون آیین دادرسی مدنی."},
{term:"خیار",definition:"اختیار قانونی یا قراردادی برای برهم‌زدن معامله در شرایط مقرر.",note:"نوع خیار، فوریت و امکان اسقاط آن متفاوت است.",basis:"مواد ۳۹۶ به بعد قانون مدنی."},
{term:"تدلیس",definition:"عملیات فریبنده مؤثر در ترغیب طرف معامله، با شرایط مقرر قانونی.",note:"صرف پنهان‌کردن هر موضوعی لزوماً تدلیس حقوقی نیست.",basis:"ماده ۴۳۸ قانون مدنی و مقررات مرتبط."},
{term:"اعتراض ثالث",definition:"اعتراض شخصی که در دادرسی منتهی به رأی حضور نداشته و رأی به حقوق او خلل وارد کرده است.",note:"سمت، ورود خلل و شرایط شکلی باید احراز شود.",basis:"مواد ۴۱۷ به بعد قانون آیین دادرسی مدنی."}
];
const HEADERS = {"Access-Control-Allow-Origin":"*","Access-Control-Allow-Methods":"GET, OPTIONS","Access-Control-Allow-Headers":"Content-Type","Content-Type":"application/json; charset=utf-8","Cache-Control":"public, max-age=60"};
function json(data,status=200){return new Response(JSON.stringify(data),{status,headers:HEADERS});}
function normalize(value){return String(value||"").normalize("NFKC").replace(/[يى]/g,"ی").replace(/ك/g,"ک").replace(/[\u200c\s]+/g," ").trim().toLocaleLowerCase("fa-IR");}
export default {
 async fetch(request){
  const url=new URL(request.url);
  if(request.method==="OPTIONS")return new Response(null,{status:204,headers:HEADERS});
  if(url.pathname==="/health"&&request.method==="GET")return json({ok:true,service:"k-law-dictionary",version:VERSION,entries:TERMS.length});
  if(url.pathname==="/api/search"&&request.method==="GET"){
   const q=normalize(url.searchParams.get("q"));
   if(!q)return json({ok:false,error:"عبارت جست‌وجو الزامی است."},400);
   if(q.length>100)return json({ok:false,error:"عبارت جست‌وجو بیش از حد طولانی است."},400);
   const exact=TERMS.find(x=>normalize(x.term)===q||(x.aliases||[]).some(a=>normalize(a)===q));
   const matches=exact?[exact]:TERMS.filter(x=>normalize(x.term).includes(q)||(x.aliases||[]).some(a=>normalize(a).includes(q))).slice(0,10);
   return json({ok:true,query:q,source:"K-Law legal terminology seed",count:matches.length,results:matches});
  }
  return json({ok:false,error:"مسیر پیدا نشد."},404);
 }
};
