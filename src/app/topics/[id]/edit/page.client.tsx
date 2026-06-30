'use client';

import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import Button from '@mui/material/Button';
import Container from '@mui/material/Container';
import Stack from '@mui/material/Stack';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import { topicSchema, TopicInput } from '@/lib/validations/topic';
import { updateTopicAction } from '../../action';
import { ITopic } from '@/interfaces/ITopic';
import NextLink from 'next/link';

interface EditTopicPageClientProps {
    topic: ITopic;
}

const EditTopicPageClient = ({ topic }: EditTopicPageClientProps) => {
    const { control, handleSubmit, formState: { errors, isSubmitting } } = useForm<TopicInput>({
        resolver: zodResolver(topicSchema),
        // Pre-fill the form with the current values of the topic
        defaultValues: {
            title: topic.title,
            description: topic.description,
        },
    });

    const onSubmit = async (data: TopicInput) => {
        // Pass both the ID and the new form data to the server action
        await updateTopicAction(topic.id, data);
    };

    return (
        <Container maxWidth={'sm'}>
            <Typography variant={'h4'} component={'h1'} mb={4}>
                Edit Topic
            </Typography>

            <Stack component={'form'} onSubmit={handleSubmit(onSubmit)} spacing={4}>
                <Controller
                    name={'title'}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={'Topic Title'}
                            variant={'outlined'}
                            fullWidth={true}
                            error={!!errors.title}
                            helperText={errors.title ? errors.title.message : 'Title must be 5 or more characters long'}
                        />
                    )}
                />

                <Controller
                    name={'description'}
                    control={control}
                    render={({ field }) => (
                        <TextField
                            {...field}
                            label={'Description'}
                            variant={'outlined'}
                            multiline={true}
                            rows={4}
                            fullWidth={true}
                            error={!!errors.description}
                            helperText={errors.description ? errors.description.message : 'Description must be 10 or more characters long'}
                        />
                    )}
                />

                <Stack direction={'row'} spacing={2}>
                    <Button
                        type={'submit'}
                        variant={'contained'}
                        color={'primary'}
                        disabled={isSubmitting}
                    >
                        Save Changes
                    </Button>
                    <Button
                        component={NextLink}
                        href={`/topics/${topic.id}`}
                        variant={'outlined'}
                        color={'primary'}
                        disabled={isSubmitting}
                    >
                        Cancel
                    </Button>
                </Stack>
            </Stack>
        </Container>
    );
};

export default EditTopicPageClient;
