interface Props {
	params: {
		article: string
	}
}
const page = async ({ params }: Props) => {
  const { article } = await new Promise<{ article: string }>((resolve) => resolve(params))
   return (
    <div>
      detail nomenclature {article}
    </div>
  );
};
export default page;