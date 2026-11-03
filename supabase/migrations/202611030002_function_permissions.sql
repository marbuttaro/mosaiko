-- La verifica della membership usa gia la policy "Read own admin membership".
-- Non richiede privilegi del proprietario e non deve essere invocabile da anon.
alter function public.is_cms_admin() security invoker;
revoke execute on function public.is_cms_admin() from anon;

-- Supabase puo creare questo event trigger durante il provisioning con RLS automatica.
-- Manteniamo il trigger, ma togliamo l'esecuzione diretta ai client dell'API.
do $$
begin
  if to_regprocedure('public.rls_auto_enable()') is not null then
    revoke execute on function public.rls_auto_enable() from public, anon, authenticated;
  end if;
end;
$$;
