import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { api } from '../api/client';
import { useAuthStore } from '../store/auth';
import { Button } from '../components/Button';
import { useUI } from '../store/ui';

const Jobs = () => {
  const { token } = useAuthStore();
  const { showToast } = useUI();
  const queryClient = useQueryClient();

  const { data: jobs } = useQuery({
    queryKey: ['jobs', token],
    queryFn: () => api.get('/jobs?matchFor=me', token),
    enabled: Boolean(token),
  });

  const applyMutation = useMutation({
    mutationFn: (jobId: string) => api.post(`/jobs/${jobId}/apply`, {}, token),
    onSuccess: () => {
      showToast('Өтінім жіберілді (Заявка отправлена)');
      queryClient.invalidateQueries({ queryKey: ['applications'] });
    },
    onError: () => showToast('Қате болды (Ошибка)'),
  });

  return (
    <section className="mx-auto max-w-6xl px-4 py-16">
      <h1 className="text-3xl font-bold text-slate-900">Вакансиялар (Вакансии)</h1>
      <p className="mt-2 text-slate-600">Бейдж және курс нәтижелеріне негізделген жеке ұсыныстар.</p>
      <div className="mt-8 space-y-6">
        {jobs?.map((job: any) => (
          <div key={job.id} className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
            <div className="flex flex-col gap-2 md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-xl font-semibold text-primary">{job.title}</h2>
                <p className="text-sm text-slate-500">{job.city}</p>
                <p className="mt-2 text-sm text-slate-600">{job.description}</p>
              </div>
              <div className="text-sm text-slate-500">
                Match: {(job.score * 100).toFixed(0)}%
                <div className="mt-1 flex flex-wrap gap-2">
                  {(job.matches || []).map((skill: string) => (
                    <span key={skill} className="rounded-full bg-accent/20 px-3 py-1 text-xs text-accent">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <Button
              className="mt-4"
              onClick={() => applyMutation.mutate(job.id)}
              disabled={applyMutation.isPending}
            >
              Өтінім беру (Отклик)
            </Button>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Jobs;
