import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface NewPostNotificationProps {
  postTitle: string;
  postDescription?: string;
  postUrl: string;
  postImage?: string;
  unsubscribeUrl: string;
}

export function NewPostNotification({
  postTitle = 'New Post Title',
  postDescription = 'Check out our latest post!',
  postUrl = 'https://example.com/posts/new-post',
  postImage,
  unsubscribeUrl = 'https://example.com/unsubscribe',
}: NewPostNotificationProps) {
  return (
    <Html>
      <Head />
      <Preview>{postTitle}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Heading style={h1}>New Post Published!</Heading>
          
          {postImage && (
            <Section style={imageSection}>
              <Img
                src={postImage}
                alt={postTitle}
                style={image}
              />
            </Section>
          )}
          
          <Heading style={h2}>{postTitle}</Heading>
          
          {postDescription && (
            <Text style={text}>{postDescription}</Text>
          )}
          
          <Section style={buttonSection}>
            <Button style={button} href={postUrl}>
              Read Full Post
            </Button>
          </Section>
          
          <Text style={footer}>
            You received this email because you subscribed to our newsletter.
            <br />
            <Link href={unsubscribeUrl} style={link}>
              Unsubscribe
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '20px 0 48px',
  marginBottom: '64px',
  maxWidth: '600px',
};

const h1 = {
  color: '#333',
  fontSize: '24px',
  fontWeight: 'bold',
  margin: '40px 0',
  padding: '0 40px',
  textAlign: 'center' as const,
};

const h2 = {
  color: '#333',
  fontSize: '20px',
  fontWeight: 'bold',
  margin: '20px 0',
  padding: '0 40px',
};

const text = {
  color: '#666',
  fontSize: '16px',
  lineHeight: '26px',
  padding: '0 40px',
};

const imageSection = {
  padding: '0 40px',
  marginBottom: '20px',
};

const image = {
  width: '100%',
  height: 'auto',
  borderRadius: '8px',
};

const buttonSection = {
  padding: '0 40px',
  marginTop: '32px',
};

const button = {
  backgroundColor: '#000',
  borderRadius: '8px',
  color: '#fff',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  display: 'block',
  padding: '12px 20px',
};

const footer = {
  color: '#8898aa',
  fontSize: '12px',
  lineHeight: '16px',
  padding: '0 40px',
  marginTop: '32px',
  textAlign: 'center' as const,
};

const link = {
  color: '#556cd6',
  textDecoration: 'underline',
};