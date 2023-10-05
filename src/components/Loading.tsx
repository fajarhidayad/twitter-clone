import { CgSpinner } from 'react-icons/cg';

export default function Loading() {
  return (
    <section className="mt-5 flex flex-col text-center items-center justify-center">
      <CgSpinner className="animate-spin text-6xl text-blue-500" />
    </section>
  );
}
