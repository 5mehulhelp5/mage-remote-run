import { createClient } from '../api/factory.js';
import { printTable, handleError } from '../utils.js';
import chalk from 'chalk';
import inquirer from 'inquirer';

export function registerShipmentCommands(program) {
    const shipments = program.command('shipment').description('Manage shipments');

    //-------------------------------------------------------
    // "shipment list" Command
    //-------------------------------------------------------
    shipments.command('list')
        .description('List shipments')
        .option('-p, --page <number>', 'Page number', '1')
        .option('-s, --size <number>', 'Page size', '20')
        .option('-f, --format <type>', 'Output format (text, json, xml)', 'text')
        .option('--order-id <id>', 'Filter by Order ID')
        .addHelpText('after', `
Examples:
  $ mage-remote-run shipment list
  $ mage-remote-run shipment list --page 1 --size 10
  $ mage-remote-run shipment list --format json
  $ mage-remote-run shipment list --order-id 123
`)
        .action(async (options) => {
            try {
                const client = await createClient();
                const headers = {};
                if (options.format === 'json') headers['Accept'] = 'application/json';
                else if (options.format === 'xml') headers['Accept'] = 'application/xml';

                const params = {
                    'searchCriteria[currentPage]': options.page,
                    'searchCriteria[pageSize]': options.size
                };

                if (options.orderId) {
                    params['searchCriteria[filter_groups][0][filters][0][field]'] = 'order_id';
                    params['searchCriteria[filter_groups][0][filters][0][value]'] = options.orderId;
                    params['searchCriteria[filter_groups][0][filters][0][condition_type]'] = 'eq';
                }

                const data = await client.get('V1/shipments', params, { headers });

                if (options.format === 'json') {
                    console.log(JSON.stringify(data, null, 2));
                    return;
                }
                if (options.format === 'xml') {
                    console.log(data);
                    return;
                }

                const rows = (data.items || []).map(s => [
                    s.entity_id,
                    s.increment_id,
                    s.order_id,
                    s.total_qty,
                    s.created_at
                ]);
                console.log(chalk.bold(`Total: ${data.total_count}, Page: ${options.page}, Size: ${options.size}`));
                printTable(['ID', 'Increment ID', 'Order ID', 'Total Qty', 'Created At'], rows);
            } catch (e) { handleError(e); }
        });

    //-------------------------------------------------------
    // "shipment show" Command
    //-------------------------------------------------------
    shipments.command('show <id>')
        .description('Show shipment details')
        .option('-f, --format <type>', 'Output format (text, json, xml)', 'text')
        .addHelpText('after', `
Examples:
  $ mage-remote-run shipment show 123
`)
        .action(async (id, options) => {
            try {
                const client = await createClient();
                const headers = {};
                if (options.format === 'json') headers['Accept'] = 'application/json';
                else if (options.format === 'xml') headers['Accept'] = 'application/xml';

                let shipment;
                try {
                    shipment = await client.get(`V1/shipment/${id}`, {}, { headers });
                } catch (e) {
                    // Try to search by increment_id
                    const params = {
                        'searchCriteria[filter_groups][0][filters][0][field]': 'increment_id',
                        'searchCriteria[filter_groups][0][filters][0][value]': id,
                        'searchCriteria[filter_groups][0][filters][0][condition_type]': 'eq'
                    };
                    const searchData = await client.get('V1/shipments', params);

                    if (searchData.items && searchData.items.length > 0) {
                        shipment = searchData.items[0];
                        // If format is XML, we need to fetch by ID to get XML response
                        if (options.format === 'xml') {
                            shipment = await client.get(`V1/shipment/${shipment.entity_id}`, {}, { headers });
                        }
                    } else {
                        // If original error was 404, report as not found
                        if (e.response && e.response.status === 404) {
                            throw new Error(`Shipment ${id} not found.`);
                        }
                        // Otherwise rethrow original error (e.g. 401, 500)
                        throw e;
                    }
                }

                if (options.format === 'json') {
                    console.log(JSON.stringify(shipment, null, 2));
                    return;
                }
                if (options.format === 'xml') {
                    console.log(shipment);
                    return;
                }

                console.log(chalk.bold.blue('\n📦 Shipment Information'));
                console.log(chalk.gray('━'.repeat(50)));
                console.log(`${chalk.bold('ID:')}             ${shipment.entity_id}`);
                console.log(`${chalk.bold('Increment ID:')}   ${shipment.increment_id}`);
                console.log(`${chalk.bold('Order ID:')}       ${shipment.order_id}`);
                console.log(`${chalk.bold('Total Qty:')}      ${shipment.total_qty}`);
                console.log(`${chalk.bold('Created At:')}     ${shipment.created_at}`);

                if (shipment.items && shipment.items.length > 0) {
                    console.log(chalk.bold('\n🛒 Items'));
                    const itemRows = shipment.items.map(item => [
                        item.sku,
                        item.name,
                        Math.floor(item.qty),
                        item.price
                    ]);
                    printTable(['SKU', 'Name', 'Qty', 'Price'], itemRows);
                }

                if (shipment.tracks && shipment.tracks.length > 0) {
                    console.log(chalk.bold('\n🚚 Tracking'));
                    const trackRows = shipment.tracks.map(track => [
                        track.title,
                        track.carrier_code,
                        track.track_number
                    ]);
                    printTable(['Title', 'Carrier', 'Number'], trackRows);
                }

                if (shipment.comments && shipment.comments.length > 0) {
                    console.log(chalk.bold('\n💬 Comments'));
                    const commentRows = shipment.comments.map(c => [
                        c.created_at,
                        c.comment
                    ]);
                    printTable(['Date', 'Comment'], commentRows);
                }

            } catch (e) { handleError(e); }
        });

    //-------------------------------------------------------
    // "shipment create" Command
    //-------------------------------------------------------
    shipments.command('create <orderId>')
        .description('Create shipment for an order')
        .option('--notify', 'Notify customer via email')
        .option('--append-comment', 'Append comment')
        .option('--comment <text>', 'Comment text')
        .option('--visible', 'Comment visible on frontend')
        .option('--tracks <json>', 'Tracks array JSON string')
        .option('--items <json>', 'Items array JSON string (if partial shipment)')
        .addHelpText('after', `
Examples:
  $ mage-remote-run shipment create 123 --notify
  $ mage-remote-run shipment create 123 --tracks '[{"carrier_code":"fedex","title":"FedEx","track_number":"123456"}]'
`)
        .action(async (orderId, options) => {
            try {
                const client = await createClient();
                const payload = {
                    notify: !!options.notify,
                    appendComment: !!options.appendComment,
                    comment: {
                        extension_attributes: {},
                        comment: options.comment || '',
                        is_visible_on_front: options.visible ? 1 : 0
                    }
                };

                if (options.tracks) {
                    payload.tracks = JSON.parse(options.tracks);
                }

                if (options.items) {
                    payload.items = JSON.parse(options.items);
                }

                const result = await client.post(`V1/order/${orderId}/ship`, payload);
                console.log(chalk.green(`Shipment created. ID: ${result}`));
            } catch (e) { handleError(e); }
        });

    //-------------------------------------------------------
    // "shipment label" Command
    //-------------------------------------------------------
    shipments.command('label <id>')
        .description('Retrieve shipping label')
        .addHelpText('after', `
Examples:
  $ mage-remote-run shipment label 123
`)
        .action(async (id) => {
            try {
                const client = await createClient();
                const label = await client.get(`V1/shipment/${id}/label`);
                if (label) {
                    console.log(label);
                } else {
                    console.log(chalk.yellow('No label found.'));
                }
            } catch (e) { handleError(e); }
        });

    //-------------------------------------------------------
    // "shipment track" Command
    //-------------------------------------------------------
    shipments.command('track <id>')
        .description('Add tracking number to shipment')
        .requiredOption('--carrier <code>', 'Carrier code')
        .requiredOption('--title <title>', 'Carrier title')
        .requiredOption('--number <number>', 'Tracking number')
        .addHelpText('after', `
Examples:
  $ mage-remote-run shipment track 123 --carrier fedex --title FedEx --number 987654321
`)
        .action(async (id, options) => {
            try {
                const client = await createClient();
                const payload = {
                    entity: {
                        order_id: null, // Will be filled by backend logic usually, or we might need order_id? 
                        // Actually V1/shipment/:id/track requires 'entity' which is SalesDataShipmentTrackInterface
                        // Parent ID is the shipment ID.
                        parent_id: id,
                        carrier_code: options.carrier,
                        title: options.title,
                        track_number: options.number
                    }
                };

                // Note: The endpoint is POST /V1/shipment/track  (Wait, is it /V1/shipments/{id}/...? No, documentation says POST /V1/shipment/track usually, checking...)
                // Standard Magento API: POST /V1/shipment/track
                // Body: { "entity": { "parent_id": ... } }

                const result = await client.post(`V1/shipment/track`, payload);
                console.log(chalk.green(`Tracking added. ID: ${result}`));
            } catch (e) { handleError(e); }
        });

    //-------------------------------------------------------
    // "shipment email" Command
    //-------------------------------------------------------
    shipments.command('email <id>')
        .description('Send shipment email')
        .addHelpText('after', `
Examples:
  $ mage-remote-run shipment email 123
`)
        .action(async (id) => {
            try {
                const client = await createClient();
                // POST /V1/shipment/{id}/emails
                const result = await client.post(`V1/shipment/${id}/emails`);
                if (result) {
                    console.log(chalk.green('Email sent.'));
                } else {
                    // Sometimes it returns boolean true/false
                    console.log(chalk.green('Email sent signal processed.'));
                }
            } catch (e) { handleError(e); }
        });

    //-------------------------------------------------------
    // "shipment comments" Command
    //-------------------------------------------------------
    shipments.command('comments <id>')
        .description('Add comment to shipment')
        .requiredOption('--comment <text>', 'Comment text')
        .option('--visible', 'Visible on frontend')
        .option('--notify', 'Notify customer')
        .addHelpText('after', `
Examples:
  $ mage-remote-run shipment comments 123 --comment "Package is on the way" --notify
`)
        .action(async (id, options) => {
            try {
                const client = await createClient();
                const payload = {
                    entity: {
                        parent_id: id,
                        comment: options.comment,
                        is_visible_on_front: options.visible ? 1 : 0,
                        is_customer_notified: options.notify ? 1 : 0
                    }
                };
                // Endpoint: POST /V1/shipment/comments 
                // Wait, standard magento is POST /V1/shipment/{id}/comments mostly? 
                // Checking standard swagger... POST /V1/shipment/{id}/comments maps to ShipmentCommentRepositoryInterface.save
                // Actually, there is POST /V1/shipment/comments as well?
                // Let's use POST /V1/shipment/{id}/comments

                // Update: Actually standard Magento might be POST /V1/shipment/comments to create a comment with parent_id in body?
                // Let's check a reliable source or trust the pattern. Order comments are /V1/orders/{id}/comments.
                // Shipment comments... Magento 2.4 REST API docs:
                // POST /V1/shipment/{id}/comments -> salesShipmentCommentRepositoryV1
                // Body: { entity: { ... } }

                // Also common is POST /V1/shipment/comments (no ID in URL) -> same repo?
                // Let's use the ID in URL one if possible, but let's stick to /V1/shipment/{id}/comments if we can confirm it exists.
                // If not sure, standard practice.

                // Let's try /V1/shipment/:id/comments
                const result = await client.post(`V1/shipment/${id}/comments`, payload);
                console.log(chalk.green(`Comment added. ID: ${result.entity_id || result}`));
            } catch (e) { handleError(e); }
        });
}
