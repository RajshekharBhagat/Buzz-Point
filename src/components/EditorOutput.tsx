import dynamic from "next/dynamic";
import Image from "next/image";
import React from "react";
const Output = dynamic(
  async () => (await import("editorjs-react-renderer")).default,
  {
    ssr: false,
  }
);
interface EditorOutputProps {
  content: any;
}

const style = {
  paragraph: {
    fontSize: "0.875rem",
    lineHeight: "1.25rem",
  },
};

function CustomImageRenderer(data: any) {
    const src = data.file.url;
    return <div className="relative">
        <Image alt="Image" className="object-cover" width={150} height={150} src={src} />
    </div>
}

function CustomCodeRenderer({data}: any) {
  return (
    <pre className="bg-gray-800 rounded-md p-4">
      <code className="text-gray-100 text-sm">
        {data.code}
      </code>
    </pre>
  )
}

const renderers = {
  image: CustomImageRenderer,
  code: CustomCodeRenderer,
};

const EditorOutput = ({ content }: EditorOutputProps) => {
  return (
    <Output
      data={content}
      style={style}
      className="text-sm"
      renderer={renderers}
    ></Output>
  );
};

export default EditorOutput;
