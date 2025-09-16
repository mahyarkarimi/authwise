'use client';
import { useEffect } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { Formik, Form, Field, FieldArray } from 'formik';
import * as Yup from 'yup';
import adminAxios from '@/lib/adminAxios';
import Button from '@/components/Button';
import { toast } from 'react-toastify';

export default function EditClientPage() {
  const router = useRouter();
  const params = useParams();
  const clientId = params?.id as string;

  const initialValues = {
    name: '',
    redirectUris: [''],
    accessTokenLifetime: 3600,
    refreshTokenLifetime: 1209600,
    grants: ['password', 'authorization_code', 'refresh_token'],
    scope: ['read', 'write'],
  };

  const validationSchema = Yup.object({
    name: Yup.string().max(100).required('Name is required'),
    redirectUris: Yup.array().of(Yup.string().required('URI required')).min(1, 'At least one URI'),
    accessTokenLifetime: Yup.number().min(60).required(),
    refreshTokenLifetime: Yup.number().min(60).required(),
    grants: Yup.array().of(Yup.string().required('Grant required')).min(1, 'At least one grant'),
    scope: Yup.array().of(Yup.string().required('Scope required')).min(1, 'At least one scope'),
  });

  const fetchClient = async (setValues: any) => {
    try {
      const res = await adminAxios.get(`/admin/clients/${clientId}`);
      const data = res.data.client;
      setValues({
        name: data.name || '',
        redirectUris: data.redirectUris?.length ? data.redirectUris : [''],
        accessTokenLifetime: data.accessTokenLifetime ?? 3600,
        refreshTokenLifetime: data.refreshTokenLifetime ?? 1209600,
        grants: data.grants?.length ? data.grants : ['password', 'authorization_code', 'refresh_token'],
        scope: data.scope?.length ? data.scope : ['read', 'write'],
      });
    } catch (err: any) {
      toast.error('Failed to load client');
      router.back();
    }
  };

  const handleSubmit = async (values: typeof initialValues, { setSubmitting }: any) => {
    try {
      await adminAxios.put(`/admin/clients/${clientId}`, values);
      toast.success('Client updated successfully');
      router.push('/admin/dashboard/clients');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to update client');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mt-8">
      <h1 className="text-3xl font-bold text-slate-900 dark:text-slate-100 mb-6">Edit Client</h1>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
        enableReinitialize
      >
        {({ values, isSubmitting, errors, touched, setValues }) => {
          useEffect(() => {
            fetchClient(setValues);
            // eslint-disable-next-line
          }, [clientId]);
          return (
            <Form className="space-y-6">
              <div>
                <label className="block font-medium mb-1 text-slate-800 dark:text-slate-100">Name</label>
                <Field name="name" className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" maxLength={100} required />
                {touched.name && errors.name && <div className="text-red-500 text-xs mt-1">{errors.name}</div>}
              </div>
              <div>
                <label className="block font-medium mb-1 text-slate-800 dark:text-slate-100">Redirect URIs</label>
                <FieldArray name="redirectUris">
                  {({ push, remove }) => (
                    <div>
                      {values.redirectUris.map((uri, idx) => (
                        <div key={idx} className="flex gap-2 mb-1">
                          <Field name={`redirectUris[${idx}]`} required
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                          {values.redirectUris.length > 1 && (
                            <Button type="button" size="sm" variant="danger" onClick={() => remove(idx)}>
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" size="sm" variant="secondary" onClick={() => push('')}>
                        Add URI
                      </Button>
                      {touched.redirectUris && typeof errors.redirectUris === 'string' && <div className="text-red-500 text-xs mt-1">{errors.redirectUris}</div>}
                    </div>
                  )}
                </FieldArray>
              </div>
              <div className="flex gap-4">
                <div className="flex-1">
                  <label className="block font-medium mb-1 text-slate-800 dark:text-slate-100">Access Token Lifetime (s)</label>
                  <Field name="accessTokenLifetime" type="number" min={60} required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                  {touched.accessTokenLifetime && errors.accessTokenLifetime && <div className="text-red-500 text-xs mt-1">{errors.accessTokenLifetime}</div>}
                </div>
                <div className="flex-1">
                  <label className="block font-medium mb-1 text-slate-800 dark:text-slate-100">Refresh Token Lifetime (s)</label>
                  <Field name="refreshTokenLifetime" type="number" min={60} required
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                  {touched.refreshTokenLifetime && errors.refreshTokenLifetime && <div className="text-red-500 text-xs mt-1">{errors.refreshTokenLifetime}</div>}
                </div>
              </div>
              <div>
                <label className="block font-medium mb-1 text-slate-800 dark:text-slate-100">Grants</label>
                <FieldArray name="grants">
                  {({ push, remove }) => (
                    <div>
                      {values.grants.map((grant, idx) => (
                        <div key={idx} className="flex gap-2 mb-1">
                          <Field name={`grants[${idx}]`} required
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                          {values.grants.length > 1 && (
                            <Button type="button" size="sm" variant="danger" onClick={() => remove(idx)}>
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" size="sm" variant="secondary" onClick={() => push('')}>
                        Add Grant
                      </Button>
                      {touched.grants && typeof errors.grants === 'string' && <div className="text-red-500 text-xs mt-1">{errors.grants}</div>}
                    </div>
                  )}
                </FieldArray>
              </div>
              <div>
                <label className="block font-medium mb-1 text-slate-800 dark:text-slate-100">Scopes</label>
                <FieldArray name="scope">
                  {({ push, remove }) => (
                    <div>
                      {values.scope.map((scope, idx) => (
                        <div key={idx} className="flex gap-2 mb-1">
                          <Field name={`scope[${idx}]`} required
                            className="flex-1 px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition" />
                          {values.scope.length > 1 && (
                            <Button type="button" size="sm" variant="danger" onClick={() => remove(idx)}>
                              Remove
                            </Button>
                          )}
                        </div>
                      ))}
                      <Button type="button" size="sm" variant="secondary" onClick={() => push('')}>
                        Add Scope
                      </Button>
                      {touched.scope && typeof errors.scope === 'string' && <div className="text-red-500 text-xs mt-1">{errors.scope}</div>}
                    </div>
                  )}
                </FieldArray>
              </div>
              <div className="flex justify-end gap-2 mt-8">
                <Button type="button" variant="secondary" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary" loading={isSubmitting}>
                  Save
                </Button>
              </div>
            </Form>
          );
        }}
      </Formik>
    </div>
  );
}