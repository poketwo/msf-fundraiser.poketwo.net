import Image from "next/image";
import React from "react";

type TwemojiProps = {
  emoji: string;
};

const Twemoji = ({ emoji }: TwemojiProps) => (
  <Image
    className="align-middle"
    src={`https://twemoji.maxcdn.com/v/latest/svg/${emoji
      .codePointAt(0)
      ?.toString(16)}.svg`}
    height="16"
    width="16"
    alt={emoji}
  />
);

export default Twemoji;
