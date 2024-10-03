// Components
import Subheading from "./Subheading";

type LivePreviewProps = {
    data: any[];
};

export default function LivePreview({ data }: LivePreviewProps) {
    return (
        <>
            <Subheading>Live Preview:</Subheading>
            <div className="border dark:border-gray-600 rounded-xl my-1">
                {/* <DynamicInvoiceTemplate {...data} /> */}
            </div>
        </>
    );
}
