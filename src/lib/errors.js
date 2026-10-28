class HttpError extends Error { constructor(status,message,code='REQUEST_ERROR',details){super(message);this.status=status;this.code=code;this.details=details;} }
function fail(res,error){const status=error.status||(error.code==='PGRST116'?404:500);if(status>=500)console.error('[api]',error.code||error.name,error.message);res.status(status).json({ok:false,error:{code:error.code||'INTERNAL_ERROR',message:status>=500&&status!==503?'The request could not be completed.':error.message,...(error.details?{details:error.details}:{})}})}
module.exports={HttpError,fail};
