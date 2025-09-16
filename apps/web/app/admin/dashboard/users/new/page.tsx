'use client';

import { useRouter } from 'next/navigation';
import { Formik, Form, Field } from 'formik';
import * as Yup from 'yup';
import adminAxios from '@/lib/adminAxios';
import Button from '@/components/Button';
import { toast } from 'react-toastify';

const initialValues = {
  username: '',
  password: '',
};

const validationSchema = Yup.object({
  username: Yup.string().min(3).max(32).required('Username is required'),
  password: Yup.string().min(6).max(100).required('Password is required'),
});

export default function NewUserPage() {
  const router = useRouter();

  const handleSubmit = async (values: typeof initialValues, { setSubmitting, resetForm }: any) => {
    try {
      await adminAxios.post('/admin/users', values);
      toast.success('User created successfully');
      router.push('/admin/dashboard/users');
    } catch (err: any) {
      toast.error(err?.response?.data?.message || 'Failed to create user');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white dark:bg-slate-800 rounded-xl shadow-lg p-8 mt-8">
      <h2 className="text-2xl font-bold mb-6 text-slate-900 dark:text-slate-100">Add New User</h2>
      <Formik
        initialValues={initialValues}
        validationSchema={validationSchema}
        onSubmit={handleSubmit}
      >
        {({ isSubmitting, errors, touched }) => (
          <Form className="space-y-6">
            <div>
              <label className="block font-medium mb-1 text-slate-800 dark:text-slate-100">Username</label>
              <Field
                name="username"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                autoComplete="off"
                required
              />
              {touched.username && errors.username && (
                <div className="text-red-500 text-xs mt-1">{errors.username}</div>
              )}
            </div>
            <div>
              <label className="block font-medium mb-1 text-slate-800 dark:text-slate-100">Password</label>
              <Field
                name="password"
                type="password"
                className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-700 text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
                required
              />
              {touched.password && errors.password && (
                <div className="text-red-500 text-xs mt-1">{errors.password}</div>
              )}
            </div>
            <div className="flex justify-end gap-2 mt-8">
              <Button type="button" variant="secondary" onClick={() => router.back()}>
                Cancel
              </Button>
              <Button type="submit" variant="primary" loading={isSubmitting}>
                Create User
              </Button>
            </div>
          </Form>
        )}
      </Formik>
    </div>
  );
}