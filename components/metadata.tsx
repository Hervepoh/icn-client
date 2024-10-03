import react , {FC} from 'react'
import Image from "next/image";

interface MetaProps {
    title: string;
    description: string;
    keywords: string;
}

const Metadata: FC<MetaProps> = ({title,description,keywords}) => {
  return (
    <>
      <title>{title}</title>
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Herve Ngando" />
    </>
  );
} 

export default Metadata;