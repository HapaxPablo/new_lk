interface Props {
	params: Promise<{
		article: string
	}>
}
const page = async (props: Props) => {
  const params = await props.params;
  const { article } = await new Promise<{ article: string }>((resolve) => resolve(params))
  return (
   <div>
     detail nomenclature {article}
   </div>
 );
};
export default page;