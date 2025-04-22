import allenKey from "@ingka/ssr-icon/paths/allen-key";
import Button from "@ingka/button";
import SSRIcon from "@ingka/ssr-icon";
import Text from "@ingka/text";

type ErrorMessageProps = {
  message: string;
  onClick: () => void;
};

export function ErrorMessage({ message, onClick }: ErrorMessageProps) {
  return (
    <section className="error-message">
      <SSRIcon paths={allenKey} />
      <Text tagName="h2" textStyle="Heading.M">
        Something went wrong
      </Text>
      <Text tagName="p" textStyle="Body.M">
        Error: {message}
      </Text>
      <Button text="Try Again" onClick={onClick} type="primary" size="small" />
    </section>
  );
}
