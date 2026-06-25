import { supabase } from '@/lib/supabase';
import { FileText } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function TermsAndConditions() {
  const { data: settings } = await supabase
    .from('settings')
    .select('terms_policy_text')
    .eq('id', 1)
    .single();

  return (
    <div className="max-w-4xl mx-auto py-24 px-6 relative z-10">
      <div className="text-center mb-16">
        <h1 className="text-4xl md:text-5xl font-black text-[#1B1B5E] uppercase tracking-tighter mb-4 flex justify-center items-center gap-4">
          <FileText className="w-10 h-10 text-[#00AEEF]" />
          Terms and Conditions
        </h1>
        <p className="text-lg text-gray-600 font-medium tracking-wide">
          The rules governing the use of our platform.
        </p>
      </div>

      <div className="bg-white p-8 md:p-12 rounded-3xl shadow-sm border border-[#1B1B5E]/5 space-y-8 prose prose-lg prose-headings:text-[#1B1B5E] prose-headings:font-black prose-headings:uppercase prose-headings:tracking-widest prose-a:text-[#00AEEF] max-w-none text-gray-600">
        {settings?.terms_policy_text ? (
          <div dangerouslySetInnerHTML={{ __html: settings.terms_policy_text.replace(/\n/g, '<br/>') }} />
        ) : (
          <p>Policy currently unavailable.</p>
        )}
      </div>
    </div>
  );
}
